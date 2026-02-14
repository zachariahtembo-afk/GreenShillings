# Green Shillings - Databricks Phase 1 Implementation Guide

## Overview

This document outlines the implementation of Phase 1 AI/ML features using Databricks for fraud detection, automated MRV scheduling, satellite quality prediction, and farmer support chatbot.

## Database Schema (✅ COMPLETED)

### New Models Added:

1. **Alert** - Track all system alerts (fraud, anomalies, risks)
2. **FraudScore** - ML-based fraud detection with confidence scoring
3. **MRVSchedule** - Automated MRV scheduling with optimal timing
4. **SatelliteQuality** - Image quality prediction and tracking
5. **FarmerMessage** - NLP chatbot messages (SMS/WhatsApp)

### Enums:

- `AlertSeverity`: LOW, MEDIUM, HIGH, CRITICAL
- `AlertStatus`: ACTIVE, ACKNOWLEDGED, RESOLVED, DISMISSED
- `AlertType`: FRAUD_DETECTION, ANOMALY_DETECTED, MRV_READY, SATELLITE_QUALITY, CLIMATE_RISK, FARMER_CHURN_RISK

## Feature 1: Fraud Detection & Anomaly Alerts

### Purpose

Detect suspicious activity in carbon credit claims using ML pattern recognition.

### Detection Methods

#### 1. NDVI Anomaly Detection

```python
# Databricks Notebook: /Green-Shillings/Fraud-Detection/NDVI-Anomaly-Detector

def detect_ndvi_anomalies(parcel_id):
    # Get historical NDVI data
    ndvi_history = spark.sql(f"""
        SELECT captureDate, vegetationIndex
        FROM satellite_captures
        WHERE parcelId = '{parcel_id}'
        ORDER BY captureDate
    """)

    # Calculate moving average and std deviation
    window_size = 5
    ndvi_values = [row.vegetationIndex for row in ndvi_history.collect()]

    anomalies = []
    for i in range(window_size, len(ndvi_values)):
        window = ndvi_values[i-window_size:i]
        mean = sum(window) / len(window)
        std = (sum((x - mean) ** 2 for x in window) / len(window)) ** 0.5

        current = ndvi_values[i]
        z_score = (current - mean) / (std + 0.001)

        # Flag if more than 2 standard deviations
        if abs(z_score) > 2:
            anomalies.append({
                'date': ndvi_history.collect()[i].captureDate,
                'value': current,
                'expected': mean,
                'z_score': z_score,
                'severity': 'HIGH' if abs(z_score) > 3 else 'MEDIUM'
            })

    return anomalies
```

#### 2. Claim Discrepancy Detection

```python
# Detect when claimed carbon doesn't match satellite evidence

def detect_claim_discrepancy(mrv_batch_id):
    batch = spark.sql(f"""
        SELECT b.*, p.areaSqMeters, AVG(s.vegetationIndex) as avgNDVI
        FROM mrv_batches b
        JOIN parcels p ON b.parcelId = p.id
        JOIN satellite_captures s ON s.parcelId = p.id
        WHERE b.id = '{mrv_batch_id}'
        AND s.captureDate BETWEEN b.startDate AND b.endDate
        GROUP BY b.id, p.areaSqMeters
    """).first()

    # Estimate carbon from satellite
    area_ha = batch.areaSqMeters / 10000
    estimated_carbon = batch.avgNDVI * 150 * 0.47 * area_ha  # biomass formula
    claimed_carbon = batch.tonnesCO2e

    discrepancy = abs(estimated_carbon - claimed_carbon) / claimed_carbon

    if discrepancy > 0.3:  # 30% threshold
        return {
            'fraud_score': min(discrepancy * 100, 100),
            'risk_level': 'CRITICAL' if discrepancy > 0.5 else 'HIGH',
            'estimated_carbon': estimated_carbon,
            'claimed_carbon': claimed_carbon,
            'discrepancy_pct': discrepancy * 100
        }

    return None
```

### API Endpoints to Implement

```typescript
// apps/api/src/fraud-detection-service.ts

// Run fraud detection on a parcel
POST /ai/fraud-detection/parcel/:id
Response: {
  parcelId: string;
  fraudScore: number; // 0-100
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  factors: {
    ndviAnomalies: number;
    claimDiscrepancies: number;
    patternSuspicion: number;
  };
  alerts: Alert[];
}

// Run fraud detection on MRV batch
POST /ai/fraud-detection/mrv/:id
Response: {
  batchId: string;
  validated: boolean;
  fraudScore: number;
  issues: string[];
}

// Get all fraud alerts
GET /ai/fraud-detection/alerts?status=ACTIVE&severity=HIGH
Response: {
  alerts: Alert[];
  total: number;
}
```

---

## Feature 2: Automated MRV Scheduling

### Purpose

Predict optimal times for MRV verification based on vegetation cycles and cloud-free windows.

### Databricks Job

```python
# /Green-Shillings/MRV-Scheduling/Optimal-Schedule-Predictor

def predict_mrv_schedule(parcel_id):
    # Get NDVI trend to find vegetation peak
    ndvi_data = spark.sql(f"""
        SELECT MONTH(captureDate) as month, AVG(vegetationIndex) as avgNDVI
        FROM satellite_captures
        WHERE parcelId = '{parcel_id}'
        AND captureDate >= DATE_SUB(CURRENT_DATE(), 365)
        GROUP BY MONTH(captureDate)
        ORDER BY avgNDVI DESC
    """)

    peak_months = [row.month for row in ndvi_data.take(3)]

    # Predict cloud-free windows
    cloud_history = spark.sql(f"""
        SELECT MONTH(captureDate) as month, AVG(cloudCover) as avgCloud
        FROM satellite_captures
        WHERE parcelId = '{parcel_id}'
        GROUP BY MONTH(captureDate)
        ORDER BY avgCloud ASC
    """)

    low_cloud_months = [row.month for row in cloud_history.filter("avgCloud < 30").collect()]

    # Find intersection of peak vegetation + low cloud
    optimal_months = list(set(peak_months) & set(low_cloud_months))

    return {
        'optimal_months': optimal_months,
        'peak_vegetation_months': peak_months,
        'low_cloud_months': low_cloud_months,
        'recommended_date': calculate_next_date(optimal_months)
    }
```

### API Endpoints

```typescript
// Auto-schedule MRV for all parcels
POST /ai/mrv-scheduling/optimize
Response: {
  scheduled: number;
  parcels: {
    parcelId: string;
    scheduledDate: Date;
    reason: string;
    cloudProbability: number;
  }[];
}

// Get MRV schedule for parcel
GET /ai/mrv-scheduling/parcel/:id
Response: {
  parcelId: string;
  nextScheduledDate: Date;
  optimalWindow: boolean;
  reason: string;
}
```

---

## Feature 3: Satellite Image Quality Prediction

### Purpose

Predict image quality before ordering expensive satellite captures, reducing wasted API calls.

### Implementation

```python
# /Green-Shillings/Satellite-Quality/Quality-Predictor

from pyspark.ml.regression import RandomForestRegressor

def train_quality_model():
    # Historical data: weather, season, location -> quality score
    training_data = spark.sql("""
        SELECT
            MONTH(captureDate) as month,
            DAYOFYEAR(captureDate) as day_of_year,
            cloudCover,
            vegetationIndex,
            CASE
                WHEN cloudCover < 10 AND vegetationIndex > 0.3 THEN 100
                WHEN cloudCover < 30 THEN 70
                ELSE 30
            END as quality_score
        FROM satellite_captures
        WHERE cloudCover IS NOT NULL
    """)

    rf = RandomForestRegressor(featuresCol="features", labelCol="quality_score")
    model = rf.fit(training_data)
    model.save("/dbfs/models/satellite-quality-v1")
    return model

def predict_capture_quality(parcel_id, target_date):
    model = RandomForestRegressor.load("/dbfs/models/satellite-quality-v1")

    features = prepare_features(parcel_id, target_date)
    prediction = model.transform(features).select("quality_score").first()

    return {
        'expected_quality': prediction.quality_score,
        'usability': 'EXCELLENT' if prediction.quality_score > 80 else 'GOOD',
        'recommend_capture': prediction.quality_score > 60
    }
```

### API Endpoints

```typescript
// Predict quality before capture
POST /ai/satellite-quality/predict
Body: { parcelId: string; targetDate: Date }
Response: {
  expectedQuality: number;
  usability: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  recommendCapture: boolean;
  alternativeDates: Date[];
}

// Analyze existing capture quality
POST /ai/satellite-quality/analyze/:captureId
Response: {
  qualityScore: number;
  issues: string[];
  usability: string;
}
```

---

## Feature 4: NLP Farmer Support Chatbot

### Purpose

Provide automated support to farmers via SMS/WhatsApp in local language (Chichewa/English).

### Architecture

```
Farmer SMS/WhatsApp → Twilio Webhook → API → Databricks NLP → Response
```

### Databricks NLP Pipeline

```python
# /Green-Shillings/NLP/Farmer-Support-Bot

from pyspark.ml import Pipeline
from pyspark.ml.feature import Tokenizer, StopWordsRemover
from pyspark.ml.classification import LogisticRegression

# Intent classification model
intents = [
    "QUESTION_PAYOUT",        # "When will I get paid?"
    "QUESTION_CARBON",        # "How many carbon credits do I have?"
    "QUESTION_MRV",           # "When is next verification?"
    "SUPPORT_REQUEST",        # "I need help"
    "PARCEL_STATUS"           # "How is my land doing?"
]

def classify_intent(message):
    # Preprocess
    tokenizer = Tokenizer(inputCol="message", outputCol="words")
    remover = StopWordsRemover(inputCol="words", outputCol="filtered")

    # Load trained model
    model = LogisticRegression.load("/dbfs/models/intent-classifier-v1")

    prediction = model.transform(message_df).select("prediction").first()
    return intents[int(prediction)]

def generate_response(farmer_id, intent, message):
    if intent == "QUESTION_PAYOUT":
        payouts = get_farmer_payouts(farmer_id)
        if payouts.pending:
            return f"Your payment of {payouts.pending_amount} GTS is being processed. Expected in 3-5 days."
        else:
            return "You have no pending payments. Next payout after MRV verification."

    elif intent == "QUESTION_CARBON":
        credits = get_farmer_credits(farmer_id)
        return f"You have earned {credits.total_co2e} tonnes CO2e across {credits.count} credits."

    elif intent == "QUESTION_MRV":
        schedule = get_next_mrv(farmer_id)
        return f"Next verification scheduled for {schedule.date}. We'll notify you 1 week before."

    # ... more intent handlers
```

### API Endpoints

```typescript
// Webhook for incoming farmer messages
POST /ai/farmer-support/incoming
Body: {
  from: string; // phone number
  message: string;
  channel: "SMS" | "WHATSAPP";
}
Response: {
  reply: string;
  intent: string;
}

// Get message history
GET /ai/farmer-support/messages/:farmerId
Response: {
  messages: FarmerMessage[];
}

// Send proactive message
POST /ai/farmer-support/send
Body: {
  farmerId: string;
  message: string;
  channel: "SMS" | "WHATSAPP";
}
```

---

## Implementation Timeline

### Week 1: Schema & Infrastructure

- ✅ Database schema (DONE)
- ✅ Push schema to production (DONE)
- ✅ Create API service structures (DONE)
- [ ] Create Databricks workspace folders
- [ ] Set up Databricks authentication

### Week 2: Fraud Detection

- ✅ Create fraud detection API endpoints (DONE - preliminary algorithms)
- [ ] Implement Databricks NDVI anomaly detection
- [ ] Build Databricks claim discrepancy checker
- [ ] Integrate Databricks ML models with API
- [ ] Build admin alerts dashboard

### Week 3: MRV Scheduling

- ✅ Create MRV scheduling API endpoints (DONE - preliminary algorithms)
- [ ] Implement Databricks vegetation peak prediction
- [ ] Build Databricks cloud probability model
- [ ] Integrate Databricks optimal window calculator
- [ ] Create auto-schedule batch job

### Week 4: Satellite Quality & NLP

- ✅ Create satellite quality API endpoints (DONE - preliminary algorithms)
- ✅ Create farmer support chatbot API endpoints (DONE - keyword matching)
- [ ] Train Databricks quality prediction model
- [ ] Train Databricks NLP intent classifier
- [ ] Integrate Databricks models with API
- [ ] Twilio/WhatsApp integration
- [ ] Farmer chatbot UI

---

## ✅ Completed API Endpoints

All Phase 1 API services have been implemented with preliminary algorithms. These endpoints are ready to use and will be enhanced with Databricks ML models in subsequent weeks.

### Fraud Detection Service (`/ai/fraud-detection`)

- `POST /ai/fraud-detection/parcel/:id` - Run fraud detection on a parcel
- `POST /ai/fraud-detection/mrv/:id` - Validate MRV batch for fraud
- `GET /ai/fraud-detection/alerts` - Get fraud alerts (supports filtering)
- `POST /ai/fraud-detection/alerts/:id/acknowledge` - Acknowledge alert
- `POST /ai/fraud-detection/alerts/:id/resolve` - Resolve alert
- `GET /ai/fraud-detection/scores/:entityType/:entityId` - Get fraud score history

### MRV Scheduling Service (`/ai/mrv-scheduling`)

- `POST /ai/mrv-scheduling/optimize` - Auto-schedule MRV for parcels
- `GET /ai/mrv-scheduling/parcel/:id` - Get MRV schedule for parcel
- `GET /ai/mrv-scheduling/pending` - Get pending MRV schedules
- `POST /ai/mrv-scheduling/:id/complete` - Mark schedule as completed
- `POST /ai/mrv-scheduling/:id/cancel` - Cancel schedule

### Satellite Quality Service (`/ai/satellite-quality`)

- `POST /ai/satellite-quality/predict` - Predict quality before capture
- `POST /ai/satellite-quality/analyze/:captureId` - Analyze existing capture
- `GET /ai/satellite-quality/trends/:parcelId` - Get quality trends

### Farmer Support Service (`/ai/farmer-support`)

- `POST /ai/farmer-support/incoming` - Process incoming farmer message (webhook)
- `GET /ai/farmer-support/messages/:farmerId` - Get message history
- `POST /ai/farmer-support/send` - Send proactive message to farmer
- `GET /ai/farmer-support/stats` - Get conversation statistics

**Note:** All services are currently using preliminary algorithms. Integration with Databricks ML models will enhance accuracy and add advanced features.

---

## Databricks Setup Checklist

1. **Create Clusters**

   - Development: Standard_DS3_v2 (1 driver, 2 workers)
   - Production: Standard_DS4_v2 (1 driver, 4-8 workers, autoscaling)

2. **Upload Notebooks**

   ```
   /Green-Shillings/
     ├── Fraud-Detection/
     │   ├── NDVI-Anomaly-Detector
     │   └── Claim-Discrepancy-Checker
     ├── MRV-Scheduling/
     │   ├── Optimal-Schedule-Predictor
     │   └── Batch-Auto-Scheduler
     ├── Satellite-Quality/
     │   ├── Quality-Predictor
     │   └── Model-Training
     └── NLP/
         ├── Intent-Classifier
         ├── Response-Generator
         └── Model-Training
   ```

3. **Schedule Jobs**

   - Daily: Fraud detection scan (all parcels)
   - Weekly: MRV scheduling optimization
   - Monthly: Retrain models with new data

4. **Set Environment Variables**
   ```bash
   DATABRICKS_HOST="https://your-workspace.cloud.databricks.com"
   DATABRICKS_TOKEN="your_token"
   DATABRICKS_CLUSTER_ID="1234-567890-abc123"
   ```

---

## Testing Strategy

### Unit Tests

```typescript
// Test fraud detection
describe('FraudDetection', () => {
  it('should flag high NDVI drop', async () => {
    const result = await detectNDVIAnomaly(parcelId);
    expect(result.fraudScore).toBeGreaterThan(70);
  });
});
```

### Integration Tests

```typescript
// Test end-to-end flow
describe('MRVScheduling', () => {
  it('should schedule MRV at optimal time', async () => {
    const schedule = await optimizeMRVSchedule(parcelId);
    expect(schedule.optimalWindow).toBe(true);
  });
});
```

---

## Monitoring & Alerts

### Key Metrics

- Fraud detection accuracy
- MRV scheduling hit rate (actual optimal vs predicted)
- Satellite quality prediction accuracy
- Chatbot intent classification accuracy

### Dashboards

1. **Admin Fraud Alerts** - Real-time suspicious activity
2. **MRV Schedule** - Upcoming verifications
3. **Satellite Quality Trends** - Image quality over time
4. **Farmer Support Stats** - Message volume, response time

---

## Cost Estimates

| Feature           | Monthly Databricks Cost |
| ----------------- | ----------------------- |
| Fraud Detection   | $40                     |
| MRV Scheduling    | $20                     |
| Satellite Quality | $15                     |
| NLP Chatbot       | $30                     |
| **Total**         | **~$105/month**         |

Plus:

- Twilio SMS: ~$0.01/message (estimate $20/month for 2000 messages)
- Total: **~$125/month**

---

## Next Steps

1. **Set up Databricks credentials** in `.env`:

   ```bash
   DATABRICKS_HOST="your-host"
   DATABRICKS_TOKEN="your-token"
   DATABRICKS_CLUSTER_ID="your-cluster"
   ```

2. **Push schema to production**:

   ```bash
   npx prisma db push --accept-data-loss
   ```

3. **Start with Week 1 tasks** - infrastructure setup

4. **Deploy fraud detection first** - highest ROI for investor trust

---

## Support

For questions or issues:

- Documentation: [Databricks ML Guide](https://docs.databricks.com/machine-learning/)
- Contact: dev@greenshillings.org
