//@flow

const en = {
  // Navigation
  "tabs.user": "User",
  "tabs.scanned": "Scanned",
  "title.settings": "Settings",
  "title.qrScanner": "QR Scanner",
  "title.device": "Device",

  // Login
  "login.username": "Username",
  "login.password": "Password",
  "login.server": "Server",
  "login.submit": "Login",
  "login.scanQR": "Scan a device QR code",
  "login.insecureServer": "Server must use https://",
  "login.wrongCredentials": "Wrong email or password",
  "error.cannotConnect": "Couldn't connect to {server}",

  // Devices
  "devices.emptyTitle": "Ooops!",
  "devices.emptySubtitle": "You could add a device...",
  "devices.addFromClipboard": "from clipboard",
  "devices.addFromQR": "from QR scanner",
  "devices.add": "Add device",
  "devices.added": "Added!",
  "devices.settings": "Settings",

  // Device / resources
  "device.offline": "{device} is offline",
  "device.unauthorized": "{user} isn't authorized",
  "device.expired": "The token for {device} has expired.\nScan a new QR code.",
  "device.serverUnreachable": "Couldn't connect to\n{server}",
  "device.loadFailed": "Couldn't load your devices. Check your connection.",
  "resource.update": "Update",
  "resource.charts": "Charts",
  "resource.post": "Post",
  "resource.run": "Run {resource}",
  "resource.postFailed": "Couldn't send value to {resource}",
  "resource.runFailed": "Couldn't run {resource}",
  "action.reload": "Reload",

  // Device settings
  "info.device": "Device",
  "info.user": "User",
  "info.description": "Description",
  "info.alias": "Alias",
  "info.server": "Server",
  "info.tokenQR": "Token QR",
  "info.tokenCreated": "Token creation date",
  "info.tokenExpires": "Token expiration date",
  "info.never": "Never",
  "info.unknown": "Unknown",

  // User settings
  "settings.user": "User",
  "settings.server": "Server",
  "settings.logout": "Log out",

  // QR scanner
  "qr.permissionTitle": "Permission to use camera",
  "qr.permissionMessage": "The camera is used to scan your device QR codes",
  "qr.hint": "Scan your device token QR",
  "token.exists": "This device already exists",
  "token.expired": "This device token has expired",
  "token.invalid": "This isn't a valid device token",

  // Charts
  "chart.selectOne": "Select at least one resource!",
  "chart.selectTwo": "Select two or more resources!"
};

export default en;
