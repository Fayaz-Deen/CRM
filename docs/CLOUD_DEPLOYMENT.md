# Cloud Deployment Guide

This guide covers deploying Personal CRM to AWS and Google Cloud Platform with managed MySQL databases.

---

## Table of Contents

1. [AWS Deployment](#aws-deployment)
2. [Google Cloud Deployment](#google-cloud-deployment)
3. [Security Best Practices](#security-best-practices)
4. [Database Migration](#database-migration)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## AWS Deployment

### Step 1: Create RDS MySQL Instance

1. **Go to AWS Console** → RDS → Create Database

2. **Configuration:**
   ```
   Engine: MySQL 8.0
   Template: Production (or Free Tier for testing)
   DB Instance Class: db.t3.micro (Free Tier) or db.t3.small+
   Storage: 20 GB (General Purpose SSD)
   Multi-AZ: Enable for production
   ```

3. **Settings:**
   ```
   DB Instance Identifier: personal-crm-db
   Master Username: admin
   Master Password: <generate-strong-password>
   ```

4. **Connectivity:**
   ```
   VPC: Default or your custom VPC
   Public Access: No (recommended)
   VPC Security Group: Create new
   Database Port: 3306
   ```

5. **Additional Configuration:**
   ```
   Initial Database Name: personal_crm
   Enable automated backups: Yes
   Backup retention: 7 days
   Enable encryption: Yes (AES-256)
   Enable Enhanced Monitoring: Yes
   ```

### Step 2: Configure Security Group

Allow inbound traffic from your application:

```
Type: MySQL/Aurora
Protocol: TCP
Port: 3306
Source: Your application's security group or IP
```

### Step 3: Deploy Application (EC2 or ECS)

#### Option A: EC2 Deployment

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Java 11
sudo amazon-linux-extras install java-openjdk11

# Copy your JAR file
scp -i your-key.pem backend/target/personal-crm-1.0.0.jar ec2-user@your-ec2-ip:/home/ec2-user/

# Create environment file
cat > /home/ec2-user/.env << EOF
AWS_RDS_ENDPOINT=your-db.xxxxx.us-east-1.rds.amazonaws.com
AWS_RDS_PORT=3306
AWS_RDS_DATABASE=personal_crm
AWS_RDS_USERNAME=admin
AWS_RDS_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
CORS_ALLOWED_ORIGINS=https://your-domain.com
SPRING_PROFILES_ACTIVE=aws
EOF

# Run the application
source /home/ec2-user/.env
java -jar personal-crm-1.0.0.jar
```

#### Option B: ECS/Fargate Deployment

Create `Dockerfile`:
```dockerfile
FROM openjdk:11-jre-slim
WORKDIR /app
COPY backend/target/personal-crm-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Step 4: Set Up Application Load Balancer

1. Create ALB with HTTPS listener (port 443)
2. Upload SSL certificate to ACM
3. Configure health check: `/api/auth/health` or just `/`
4. Add target group pointing to your EC2/ECS instances

### Environment Variables for AWS

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_RDS_ENDPOINT` | RDS endpoint | `mydb.xxxxx.us-east-1.rds.amazonaws.com` |
| `AWS_RDS_PORT` | Database port | `3306` |
| `AWS_RDS_DATABASE` | Database name | `personal_crm` |
| `AWS_RDS_USERNAME` | Database user | `admin` |
| `AWS_RDS_PASSWORD` | Database password | `your-secure-password` |
| `JWT_SECRET` | JWT signing key | `openssl rand -base64 32` |
| `CORS_ALLOWED_ORIGINS` | Allowed domains | `https://your-domain.com` |

---

## Google Cloud Deployment

### Step 1: Create Cloud SQL Instance

```bash
# Enable Cloud SQL API
gcloud services enable sqladmin.googleapis.com

# Create MySQL instance
gcloud sql instances create personal-crm-db \
    --database-version=MYSQL_8_0 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --storage-size=10GB \
    --storage-type=SSD \
    --backup \
    --backup-start-time=02:00

# Set root password
gcloud sql users set-password root \
    --host=% \
    --instance=personal-crm-db \
    --password=your-secure-password

# Create database
gcloud sql databases create personal_crm \
    --instance=personal-crm-db
```

### Step 2: Deploy to Cloud Run

```bash
# Build container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/personal-crm

# Deploy to Cloud Run
gcloud run deploy personal-crm \
    --image gcr.io/YOUR_PROJECT_ID/personal-crm \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:personal-crm-db \
    --set-env-vars "SPRING_PROFILES_ACTIVE=gcp" \
    --set-env-vars "GCP_SQL_INSTANCE=YOUR_PROJECT_ID:us-central1:personal-crm-db" \
    --set-env-vars "GCP_SQL_DATABASE=personal_crm" \
    --set-env-vars "GCP_SQL_USERNAME=root" \
    --set-secrets "GCP_SQL_PASSWORD=db-password:latest" \
    --set-secrets "JWT_SECRET=jwt-secret:latest"
```

### Step 3: Store Secrets in Secret Manager

```bash
# Create secrets
echo -n "your-db-password" | gcloud secrets create db-password --data-file=-
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-

# Grant access to Cloud Run service account
gcloud secrets add-iam-policy-binding db-password \
    --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### Environment Variables for GCP

| Variable | Description | Example |
|----------|-------------|---------|
| `GCP_SQL_INSTANCE` | Cloud SQL connection | `project:region:instance` |
| `GCP_SQL_DATABASE` | Database name | `personal_crm` |
| `GCP_SQL_USERNAME` | Database user | `root` |
| `GCP_SQL_PASSWORD` | Database password | From Secret Manager |
| `JWT_SECRET` | JWT signing key | From Secret Manager |
| `CORS_ALLOWED_ORIGINS` | Allowed domains | `https://your-domain.com` |

---

## Security Best Practices

### 1. Database Security

```
✅ Enable encryption at rest (AES-256)
✅ Use SSL/TLS for connections
✅ Restrict network access (VPC, Security Groups)
✅ Use strong passwords (min 16 characters)
✅ Enable automated backups
✅ Use IAM authentication when possible
```

### 2. Application Security

```
✅ Use HTTPS only (redirect HTTP)
✅ Store secrets in Secret Manager/Parameter Store
✅ Enable rate limiting
✅ Use strong JWT secrets (256+ bits)
✅ Set secure CORS policies
✅ Enable audit logging
```

### 3. Network Security

```
✅ Deploy in private subnets
✅ Use NAT Gateway for outbound traffic
✅ Configure WAF (Web Application Firewall)
✅ Enable DDoS protection (AWS Shield / Cloud Armor)
```

### Generate Secure JWT Secret

```bash
# Generate a secure 256-bit secret
openssl rand -base64 32

# Example output (use your own generated value):
# K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

---

## Database Migration

### First-Time Setup

The application uses `ddl-auto: validate` in production, so you need to create tables first:

```bash
# Option 1: Run with create-drop once (then switch to validate)
java -jar app.jar --spring.jpa.hibernate.ddl-auto=create

# Option 2: Use Flyway migrations (recommended)
# Add flyway dependency and create migration scripts
```

### Flyway Migration Setup (Recommended)

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-mysql</artifactId>
</dependency>
```

Create migration: `src/main/resources/db/migration/V1__initial_schema.sql`

---

## Monitoring & Maintenance

### AWS CloudWatch

```bash
# Enable CloudWatch logs
aws logs create-log-group --log-group-name /personal-crm/application

# Set up alarms for:
# - High CPU usage
# - Database connections
# - Error rates
# - Response times
```

### Google Cloud Monitoring

```bash
# Enable Cloud Logging
gcloud services enable logging.googleapis.com

# View logs
gcloud logging read "resource.type=cloud_run_revision"
```

### Backup Strategy

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| Automated DB | Daily | 7-30 days |
| Point-in-time | Continuous | 7 days |
| Manual snapshot | Weekly | 90 days |

### Cost Estimation

| Service | AWS (Monthly) | GCP (Monthly) |
|---------|---------------|---------------|
| Database (small) | $15-30 | $10-25 |
| Compute (small) | $10-20 | $5-15 |
| Load Balancer | $18 | $18 |
| Storage (10GB) | $1-2 | $1-2 |
| **Total** | **~$50-70** | **~$35-60** |

*Prices are approximate and vary by region and usage.*

---

## Quick Start Commands

### AWS
```bash
# Build and deploy
cd backend
mvn clean package -DskipTests
export SPRING_PROFILES_ACTIVE=aws
java -jar target/personal-crm-1.0.0.jar
```

### GCP
```bash
# Build and deploy
cd backend
mvn clean package -DskipTests
export SPRING_PROFILES_ACTIVE=gcp
java -jar target/personal-crm-1.0.0.jar
```

---

## Troubleshooting

### Connection Issues

```bash
# Test database connectivity
mysql -h your-endpoint -u admin -p -e "SELECT 1"

# Check security group rules
aws ec2 describe-security-groups --group-ids sg-xxxxx
```

### Application Logs

```bash
# AWS CloudWatch
aws logs tail /personal-crm/application --follow

# GCP Cloud Logging
gcloud logging tail "resource.type=cloud_run_revision"
```

---

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review security group/firewall rules
