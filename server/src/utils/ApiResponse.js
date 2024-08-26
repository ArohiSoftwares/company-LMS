
class ApiResponse {
    constructor(
        statusCode,
        message, 
        data, 
        anything,
    
    ) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.anything = anything;
        this.success = statusCode < 400;
    }
}


export default ApiResponse;