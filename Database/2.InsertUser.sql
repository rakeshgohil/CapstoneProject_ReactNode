USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_CreateUser
    @FirstName NVARCHAR(100),
    @Lastname NVARCHAR(100),
    @PasswordHash VARBINARY(64),
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        THROW 50001, 'Email already exists', 1;
    END
    
    INSERT INTO Users (FirstName, LastName, PasswordHash, Email)
    VALUES (@FirstName, @LastName, @PasswordHash, @Email);
END
GO

USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_UpdatePassword
    @PasswordHash VARBINARY(64),
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
        
    UPDATE Users 
	SET PasswordHash = @PasswordHash 
	WHERE Email = @Email
END
GO

USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_UpdateUser
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
            
    UPDATE Users 
	SET FirstName = @FirstName, LastName = @LastName
	WHERE Email = @Email
END