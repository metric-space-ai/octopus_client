import type {PartialLocaleType} from './index';

const sp: PartialLocaleType = {
  WIP: 'En proceso...',
  Error: {
    Unauthorized: 'Acceso no autorizado, por favor ingresa el código de acceso en la página de configuración.',
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} mensajes`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} mensajes con ChatGPT`,
    Actions: {
      ChatList: 'Ir a la lista de chats',
      CompressedHistory: 'Prompt de memoria comprimida',
      Export: 'Exportar todos los mensajes como Markdown',
      Copy: 'Copiar',
      Stop: 'Detener',
      Retry: 'Reintentar',
      Delete: 'Eliminar',
    },
    Rename: 'Renombrar chat',
    Typing: 'Escribiendo...',
    Input: (submitKey: string) => {
      const inputHints = `${submitKey} para enviar`;
      return inputHints;
    },
    InputPlaceholder: 'Pregunta cualquier cosa',
    Send: 'Enviar',
    Config: {
      Reset: 'Restablecer a predeterminado',
      SaveAs: 'Guardar como máscara',
    },
  },
  Export: {
    Title: 'Todos los mensajes',
    Copy: 'Copiar todo',
    Download: 'Descargar',
    MessageFromYou: 'Tu mensaje',
    MessageFromChatGPT: 'Mensaje de ChatGPT',
  },
  Memory: {
    Title: 'Prompt de memoria',
    EmptyContent: 'Aún nada.',
    Send: 'Enviar memoria',
    Copy: 'Copiar memoria',
    Reset: 'Reiniciar sesión',
    ResetConfirm:
      'Reiniciar eliminará el historial de conversación actual y la memoria a largo plazo. ¿Realmente quieres reiniciar?',
  },
  Home: {
    NewTicket: 'Nuevo chat',
    DeleteChat: '¿Confirmar para eliminar el chat seleccionado?',
    DeleteToast: 'Chat eliminado',
    Revert: 'Revertir',
  },
  Settings: {
    Title: 'Configuraciones',
    SubTitle: 'Todas las configuraciones',
    Actions: {
      ClearAll: 'Borrar todos los datos',
      ResetAll: 'Restablecer todas las configuraciones',
      Close: 'Cerrar',
      ConfirmResetAll: '¿Realmente quieres restablecer todas las configuraciones?',
      ConfirmClearAll: '¿Realmente quieres borrar todos los chats?',
    },
    Lang: {
      Name: 'Idioma', // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: 'Todos los idiomas',
    },
    Avatar: 'Avatar',
    FontSize: {
      Title: 'Tamaño de fuente',
      SubTitle: 'Ajustar el tamaño de fuente del contenido del chat',
    },
    Update: {
      Version: (x: string) => `Versión: ${x}`,
      IsLatest: 'Última versión',
      CheckUpdate: 'Verificar actualización',
      IsChecking: 'Comprobando actualización...',
      FoundUpdate: (x: string) => `Nueva versión encontrada: ${x}`,
      GoToUpdate: 'Actualizar',
    },
    SendKey: 'Tecla de envío',
    Theme: 'Tema',
    TightBorder: 'Borde ajustado',
    SendPreviewBubble: {
      Title: 'Enviar burbuja de vista previa',
      SubTitle: 'Vista previa de markdown en burbuja',
    },
    Mask: {
      Title: 'Pantalla de inicio de máscara',
      SubTitle: 'Mostrar una pantalla de inicio de máscara antes de comenzar un nuevo chat',
    },
    Prompt: {
      Disable: {
        Title: 'Deshabilitar autocompletar',
        SubTitle: 'Iniciar autocompletar con /',
      },
      List: 'Lista de prompts',
      ListCount: (builtin: number, custom: number) => `${builtin} integrados, ${custom} personalizados`,
      Edit: 'Editar',
      Modal: {
        Title: 'Lista de Prompts',
        Add: 'Agregar uno',
        Search: 'Buscar Prompts',
      },
      EditModal: {
        Title: 'Editar Prompt',
      },
    },
    HistoryCount: {
      Title: 'Número de mensajes adjuntos',
      SubTitle: 'Número de mensajes enviados adjuntos por solicitud',
    },
    CompressThreshold: {
      Title: 'Umbral de compresión de historial',
      SubTitle: 'Comprimir cuando la longitud de los mensajes no comprimidos exceda este valor',
    },
    Token: {
      Title: 'Clave API',
      SubTitle: 'Usa tu clave para ignorar el límite de código de acceso',
      Placeholder: 'Clave API de OpenAI',
    },
    Usage: {
      Title: 'Saldo de cuenta',
      SubTitle(used: any, total: any) {
        return `Este mes gastado $${used}, Suscripción $${total}`;
      },
      IsChecking: 'Comprobando...',
      Check: 'Verificar de nuevo',
      NoAccess: 'Ingresa la clave API para verificar el saldo',
    },
    AccessCode: {
      Title: 'Código de acceso',
      SubTitle: 'Control de acceso habilitado',
      Placeholder: 'Se requiere código de acceso',
    },
    Model: 'Modelo',
    Temperature: {
      Title: 'Temperatura',
      SubTitle: 'Un valor mayor lleva a respuestas más aleatorias',
    },
    MaxTokens: {
      Title: 'Máximos tokens',
      SubTitle: 'Número máximo de tokens de solicitud más respuesta',
    },
    PresencePenalty: {
      Title: 'Penalización por presencia',
      SubTitle: 'Un valor mayor aumenta la probabilidad de hablar sobre temas nuevos',
    },
    FrequencyPenalty: {
      Title: 'Penalización por frecuencia',
      SubTitle: 'Un valor mayor reduce la probabilidad de repetir la misma línea',
    },
  },
  Store: {
    DefaultTopic: 'Conversación nueva',
    BotHello: '¡Hola! ¿Cómo puedo ayudarte hoy?',
    Error: 'Algo salió mal, por favor intenta de nuevo más tarde.',
    Prompt: {
      History: (content: string) =>
        'Este es un resumen del historial de chat entre la IA y el usuario como revisión: ' + content,
      Topic:
        'Por favor crea un título de cuatro a cinco palabras que resuma nuestra conversación, sin introducciones, puntuación, comillas, puntos, símbolos o texto adicional. Elimina las comillas.',
      Summarize:
        'Resume nuestra discusión brevemente en 200 palabras o menos para usarlo como prompt para futuras conversaciones.',
    },
  },
  Copy: {
    Success: 'Copiado al portapapeles',
    Failed: 'Fallo al copiar, por favor otorga permiso para acceder al portapapeles',
  },
  Context: {
    Toast: (x: any) => `Con ${x} prompts de contexto`,
    Edit: 'Editar prompts de contexto y memoria',
    Add: 'Añadir',
  },
  Plugin: {
    Name: 'Plugin',
  },
  Mask: {
    Name: 'Máscara',
    Page: {
      Title: 'Plantilla de Prompt',
      SubTitle: (count: number) => `${count} plantillas de prompt`,
      Search: 'Buscar Plantillas',
      Create: 'Crear',
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: 'Chat',
      View: 'Ver',
      Edit: 'Editar',
      Delete: 'Eliminar',
      DeleteConfirm: '¿Confirmar para eliminar?',
    },
    EditModal: {
      Title: (readonly: boolean) => `Editar Plantilla de Prompt ${readonly ? '(solo lectura)' : ''}`,
      Download: 'Descargar',
      Clone: 'Clonar',
    },
    Config: {
      Avatar: 'Avatar del bot',
      Name: 'Nombre del bot',
    },
  },
  NewChat: {
    Return: 'Regresar',
    Skip: 'Saltar',
    Title: 'Elige una máscara',
    SubTitle: 'Chatea con el alma detrás de la máscara',
    More: 'Encontrar más',
    NotShow: 'No mostrar de nuevo',
    ConfirmNoShow: 'Confirmar para deshabilitar? Puedes habilitarlo más tarde en configuraciones.',
  },

  UI: {
    Confirm: 'Confirmar',
    Cancel: 'Cancelar',
    Close: 'Cerrar',
    Create: 'Crear',
    Edit: 'Editar',
  },
  Exporter: {
    Model: 'Modelo',
    Messages: 'Mensajes',
    Topic: 'Tema',
    Time: 'Tiempo',
  },
};

export default sp;
