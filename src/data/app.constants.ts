export enum AppMessages {
  DEFAULT_ERROR = "An unexpected error occurred, please try again later",
  NOT_FOUND = "Resource not found",
  DB_CONN_SUCCESS = "Connected to DB",
  DB_CONN_FAIL = "Error accrued while connecting to DB",
  INVALID_CREDENTIALS = "Invalid credentials",
  ACCOUNT_INACTIVE = "Account is inactive, please contact to adminstrator",
  SESSION_EXPIRED = "Invalid Session/Session Expired",
  UNAUTHORIZED = "Unauthorized Access",
}

export enum AppDefaults {
  ONE_DAY_IN_MILLISECONDS = 86400000,
  JWT_TOKEN_EXPIRES_IN = "1d",
}

export enum CommonConst {
  BASE64 = "base64",
  ASCII = "ascii",
  EMPTY_STRING = "",
  JWT_TOKEN_PREFIX = "Bearer ",
}

export enum Environment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum MongooseInternalKeys {
  CAST_ERROR = "CastError",
  OBJECT_ID = "ObjectId",
  ALREADY_EXIST_ERROR_CODE = 11000,
}

export enum UserRoles {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  CUSTOMER = "CUSTOMER",
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum Routes {
  ROOT = "/",
  AUTH = "/auth",
}

export enum Endpoints {
  ROOT = "/",
  LOGIN = "/login",
  LOGOUT = "/logout",
  REGISTER = "/register",
}

export enum ValidationKeys {
  NEW_USER = "new_user",
  LOGIN = "login",
}

export enum SchemaNames {
  USER = "User",
}

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}
