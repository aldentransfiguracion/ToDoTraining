import boto3

bucket_name = 'development'
cors_configuration = {
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}

s3_client = boto3.client(
  "s3",
  endpoint_url="http://localhost:4566",
  aws_access_key_id="test",
  aws_secret_access_key="test",
)

s3_client.create_bucket(Bucket=bucket_name)

s3_client.put_bucket_cors(
  Bucket=bucket_name,
  CORSConfiguration=cors_configuration
)