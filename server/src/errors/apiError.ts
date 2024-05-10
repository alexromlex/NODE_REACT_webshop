export default class ApiError extends Error {
  message: any;
  status: number;

  constructor(status: number, message: any) {
    super();
    this.status = status;
    this.message = message;
  }

  static notFound(message: any) {
    return new ApiError(404, message);
  }
  static internal(message: any) {
    return new ApiError(500, message);
  }
  static forbidden(message: any) {
    return new ApiError(483, message);
  }
  static invalid(message: any) {
    return new ApiError(403, message);
  }
}
