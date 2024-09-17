USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_SaveFile
    @FileName NVARCHAR(255),
    @FilePath NVARCHAR(255),
    @UserId INT,
	@Secret NVARCHAR(255),
	@SharedUserIDs VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Files ([FileName], FilePath, UploadedBy, [Secret], [SharedUserIDs])
    VALUES (@FileName, @FilePath, @UserId, @Secret, @SharedUserIDs);
END
