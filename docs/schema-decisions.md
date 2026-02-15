Since mongodb is limited in document **size(16MB)**, properties should reference landlord. 

This is because we do not **store arrays of properties inside users.**

By doing so we won't have to struggle when updating and also we will remain in the range of 16MB documents size as required by mongodb. 

This is called **Unidirectional referencing**