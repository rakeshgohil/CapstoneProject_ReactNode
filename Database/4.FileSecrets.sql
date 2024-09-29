USE SecureStorageDB
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT FOREIGN KEY REFERENCES Files(FileID),    
    UserID INT FOREIGN KEY REFERENCES Users(UserID),  
    SecretPart NVARCHAR(255),
	HmacSignature NVARCHAR(MAX),
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB2
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,
    SecretPart NVARCHAR(255),
	HmacSignature NVARCHAR(MAX),
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB3
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,
    SecretPart NVARCHAR(255),
	HmacSignature NVARCHAR(MAX),
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB4
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,
    SecretPart NVARCHAR(255),
	HmacSignature NVARCHAR(MAX),
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB5
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,
    SecretPart NVARCHAR(255),
	HmacSignature NVARCHAR(MAX),
    AssignedAt DATETIME DEFAULT GETDATE()
);
