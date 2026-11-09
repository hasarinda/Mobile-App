//@flow

import type { Translations } from "./index";

const es: Translations = {
  "tabs.user": "Usuario",
  "tabs.scanned": "Escaneados",
  "title.settings": "Ajustes",
  "title.qrScanner": "Escáner QR",
  "title.device": "Dispositivo",

  "login.username": "Usuario",
  "login.password": "Contraseña",
  "login.server": "Servidor",
  "login.submit": "Iniciar sesión",
  "login.scanQR": "Escanear el código QR de un dispositivo",
  "login.insecureServer": "El servidor debe usar https://",
  "login.wrongCredentials": "Email o contraseña incorrectos",
  "error.cannotConnect": "No se pudo conectar con {server}",

  "devices.emptyTitle": "¡Vaya!",
  "devices.emptySubtitle": "Puedes añadir un dispositivo...",
  "devices.addFromClipboard": "desde el portapapeles",
  "devices.addFromQR": "desde el escáner QR",
  "devices.add": "Añadir dispositivo",
  "devices.added": "¡Añadido!",
  "devices.settings": "Ajustes",

  "device.offline": "{device} está desconectado",
  "device.unauthorized": "{user} no está autorizado",
  "device.expired":
    "El token de {device} ha caducado.\nEscanea un nuevo código QR.",
  "device.serverUnreachable": "No se pudo conectar con\n{server}",
  "device.loadFailed":
    "No se pudieron cargar tus dispositivos. Revisa tu conexión.",
  "resource.update": "Actualizar",
  "resource.charts": "Gráficas",
  "resource.post": "Enviar",
  "resource.run": "Ejecutar {resource}",
  "resource.postFailed": "No se pudo enviar el valor a {resource}",
  "resource.runFailed": "No se pudo ejecutar {resource}",
  "action.reload": "Recargar",

  "info.device": "Dispositivo",
  "info.user": "Usuario",
  "info.description": "Descripción",
  "info.alias": "Alias",
  "info.server": "Servidor",
  "info.tokenQR": "QR del token",
  "info.tokenCreated": "Fecha de creación del token",
  "info.tokenExpires": "Fecha de caducidad del token",
  "info.never": "Nunca",
  "info.unknown": "Desconocida",

  "settings.user": "Usuario",
  "settings.server": "Servidor",
  "settings.logout": "Cerrar sesión",

  "qr.permissionTitle": "Permiso para usar la cámara",
  "qr.permissionMessage":
    "La cámara se usa para escanear los códigos QR de tus dispositivos",
  "qr.hint": "Escanea el QR del token de tu dispositivo",
  "token.exists": "Este dispositivo ya existe",
  "token.expired": "El token de este dispositivo ha caducado",
  "token.invalid": "Este no es un token de dispositivo válido",

  "chart.selectOne": "¡Selecciona al menos un recurso!",
  "chart.selectTwo": "¡Selecciona dos o más recursos!"
};

export default es;
