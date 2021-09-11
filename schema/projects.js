const schema = {
    bsonType: "object",
    required: [ "issue_title", "issue_text", "created_by" ],
    properties: {
        _id: {
            bsonType: "objectId",
            description: "unique issue id"
        },
        issue_title:{
            bsonType: "string",
            description: "the issue title is required"
        },
        issue_text:{
            bsonType: "string",
            description: "the issue text is required"
        },
        created_by:{
            bsonType: "string",
            description: "who created the issue"
        },
        created_on:{
            bsonType: ["date", "timestamp"],
            description: "created on date/time"
        },
        updated_on:{
            bsonType: ["date", "timestamp"],
            description: "updated on date/time"
        },
        assigned_to:{
            bsonType: "string",
            description: "who the issue is assigned to"
        },
        status_text:{
            bsonType: "string",
            description: "the issue status"
        },
        open:{
            bsonType: "bool",
            description: "open can be true or false"
        }
    }
};

module.exports = schema;