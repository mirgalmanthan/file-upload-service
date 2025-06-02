# file-upload-service
A secured file upload service in Node.js that stores file metadata in a database, runs background processing tasks, and tracks the status of those tasks.


Database tables schema
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100) REFERENCES users(user_id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  storage_path TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50) CHECK (status IN ('uploaded', 'processing', 'processed', 'failed')) NOT NULL DEFAULT 'uploaded',
  extracted_data TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  job_type VARCHAR(50),
  status VARCHAR(50) CHECK (status IN ('queued', 'processing', 'completed', 'failed')) NOT NULL,
  error_message TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

