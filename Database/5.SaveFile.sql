USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_SaveFile
    @FileName NVARCHAR(255),
    @FilePath NVARCHAR(255),
    @UserId INT,
	@Secret NVARCHAR(255),
	@SharedUserIDs VARCHAR(255),
	@EncryptionKey NVARCHAR(MAX),
    @HmacKey NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Files ([FileName], FilePath, UploadedBy, [Secret], [SharedUserIDs], EncryptionKey, HmacKey)
    VALUES (@FileName, @FilePath, @UserId, @Secret, @SharedUserIDs, @EncryptionKey, @HmacKey);
END
