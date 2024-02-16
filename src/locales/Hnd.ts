import type {PartialLocaleType} from './index';

const hnd: PartialLocaleType = {
  WIP: 'प्रगति पर है...',
  Error: {
    Unauthorized: 'अनधिकृत पहुँच, कृपया सेटिंग्स पृष्ठ पर एक्सेस कोड दर्ज करें।',
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} संदेश`,
  },
  Chat: {
    SubTitle: (count: number) => `ChatGPT के साथ ${count} संदेश`,
    Actions: {
      ChatList: 'चैट सूची पर जाएँ',
      CompressedHistory: 'संकुचित मेमोरी प्रॉम्प्ट',
      Export: 'सभी संदेशों को Markdown के रूप में निर्यात करें',
      Copy: 'कॉपी',
      Stop: 'रोकें',
      Retry: 'पुनः प्रयास करें',
      Delete: 'हटाएँ',
    },
    Rename: 'चैट का नाम बदलें',
    Typing: 'टाइप कर रहा है...',
    Input: (submitKey: string) => {
      const inputHints = `${submitKey} भेजने के लिए`;
      return inputHints;
    },
    InputPlaceholder: 'कुछ भी पूछें',
    Send: 'भेजें',
    Config: {
      Reset: 'डिफ़ॉल्ट पर रीसेट करें',
      SaveAs: 'मास्क के रूप में सेव करें',
    },
  },
  Export: {
    Title: 'सभी संदेश',
    Copy: 'सभी की प्रतिलिपि बनाएँ',
    Download: 'डाउनलोड करें',
    MessageFromYou: 'आपका संदेश',
    MessageFromChatGPT: 'ChatGPT से संदेश',
  },
  Memory: {
    Title: 'मेमोरी प्रॉम्प्ट',
    EmptyContent: 'अभी तक कुछ नहीं।',
    Send: 'मेमोरी भेजें',
    Copy: 'मेमोरी की प्रतिलिपि बनाएँ',
    Reset: 'सत्र रीसेट करें',
    ResetConfirm:
      'रीसेट करने से वर्तमान वार्तालाप इतिहास और लंबे समय तक मेमोरी मिट जाएगी। क्या आप वाकई रीसेट करना चाहते हैं?',
  },
  Home: {
    NewTicket: 'नई चैट',
    DeleteChat: 'चयनित चैट को हटाने की पुष्टि करें?',
    DeleteToast: 'चैट हटा दी गई',
    Revert: 'वापस लौटें',
  },
  Settings: {
    Title: 'सेटिंग्स',
    SubTitle: 'सभी सेटिंग्स',
    Actions: {
      ClearAll: 'सभी डेटा मिटा दें',
      ResetAll: 'सभी सेटिंग्स रीसेट करें',
      Close: 'बंद करें',
      ConfirmResetAll: 'क्या आप वाकई सभी कॉन्फ़िगरेशन रीसेट करना चाहते हैं?',
      ConfirmClearAll: 'क्या आप वाकई सभी चैट्स रीसेट करना चाहते हैं?',
    },
    Lang: {
      Name: 'भाषा', // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: 'सभी भाषाएँ',
    },
    Avatar: 'अवतार',
    FontSize: {
      Title: 'फ़ॉन्ट आकार',
      SubTitle: 'चैट सामग्री का फ़ॉन्ट आकार समायोजित करें',
    },
    Update: {
      Version: (x: string) => `संस्करण: ${x}`,
      IsLatest: 'नवीनतम संस्करण',
      CheckUpdate: 'अपडेट की जाँच करें',
      IsChecking: 'अपडेट की जाँच हो रही है...',
      FoundUpdate: (x: string) => `नया संस्करण मिला: ${x}`,
      GoToUpdate: 'अपडेट करें',
    },
    SendKey: 'सेंड की',
    Theme: 'थीम',
    TightBorder: 'तंग सीमा',
    SendPreviewBubble: {
      Title: 'प्रीव्यू बबल भेजें',
      SubTitle: 'बबल में मार्कडाउन प्रीव्यू करें',
    },
    Mask: {
      Title: 'मास्क स्टार्ट स्क्रीन',
      SubTitle: 'नई चैट शुरू करने से पहले एक मास्क स्टार्ट स्क्रीन दिखाएं',
    },
    Prompt: {
      Disable: {
        Title: 'ऑटोकम्प्लीट अक्षम करें',
        SubTitle: '/ के साथ ऑटोकम्प्लीट शुरू करें',
      },
      List: 'प्रॉम्प्ट सूची',
      ListCount: (builtin: number, custom: number) => `${builtin} निर्मित, ${custom} अनुकूलित`,
      Edit: 'संपादित करें',
      Modal: {
        Title: 'प्रॉम्प्ट सूची',
        Add: 'एक जोड़ें',
        Search: 'प्रॉम्प्ट खोजें',
      },
      EditModal: {
        Title: 'प्रॉम्प्ट संपादित करें',
      },
    },
    HistoryCount: {
      Title: 'संलग्न संदेशों की संख्या',
      SubTitle: 'प्रति अनुरोध भेजे गए संदेशों की संख्या',
    },
    CompressThreshold: {
      Title: 'इतिहास संपीड़न सीमा',
      SubTitle: 'जब असंपीड़ित संदेशों की लंबाई इस मूल्य को पार कर जाए तो संपीड़ित करें',
    },
    Token: {
      Title: 'API कुंजी',
      SubTitle: 'एक्सेस कोड सीमा को नजरअंदाज करने के लिए अपनी कुंजी का उपयोग करें',
      Placeholder: 'OpenAI API कुंजी',
    },
    Usage: {
      Title: 'खाता शेष',
      SubTitle(used: any, total: any) {
        return `इस महीने खर्च किया गया $${used}, सब्सक्रिप्शन $${total}`;
      },
      IsChecking: 'जाँच हो रही है...',
      Check: 'फिर से जाँचें',
      NoAccess: 'खाता शेष जाँचने के लिए API कुंजी दर्ज करें',
    },
    AccessCode: {
      Title: 'एक्सेस कोड',
      SubTitle: 'एक्सेस नियंत्रण सक्षम',
      Placeholder: 'एक्सेस कोड की आवश्यकता है',
    },
    Model: 'मॉडल',
    Temperature: {
      Title: 'तापमान',
      SubTitle: 'एक बड़ी मान अधिक यादृच्छिक उत्तरों की ओर ले जाती है',
    },
    MaxTokens: {
      Title: 'अधिकतम टोकन',
      SubTitle: 'अनुरोध प्लस उत्तर टोकन की अधिकतम संख्या',
    },
    PresencePenalty: {
      Title: 'उपस्थिति दंड',
      SubTitle: 'एक उच्च मूल्य नए विषयों पर चर्चा की संभावना बढ़ाता है',
    },
    FrequencyPenalty: {
      Title: 'आवृत्ति दंड',
      SubTitle: 'एक उच्च मूल्य एक ही पंक्ति को दोहराने की संभावना को कम करता है',
    },
  },
  Store: {
    DefaultTopic: 'नई बातचीत',
    BotHello: 'नमस्ते! आज मैं आपकी कैसे सहायता कर सकता हूँ?',
    Error: 'कुछ गलत हो गया, कृपया बाद में पुनः प्रयास करें।',
    Prompt: {
      History: (content: string) =>
        'यह AI और उपयोगकर्ता के बीच चैट इतिहास का एक सारांश है: ' + content,
      Topic:
        'कृपया हमारी बातचीत को संक्षेप में चार से पांच शब्दों का शीर्षक बनाएं, बिना परिचय, विराम चिह्न, उद्धरण चिह्न, बिंदु, प्रतीक या अतिरिक्त पाठ के। उद्धरण चिह्नों को हटा दें।',
      Summarize:
        'हमारी चर्चा को 200 शब्दों या उससे कम में संक्षेप में समझाएं, ताकि इसे भविष्य की बातचीत के लिए एक प्रॉम्प्ट के रूप में उपयोग किया जा सके।',
    },
  },
  Copy: {
    Success: 'क्लिपबोर्ड पर कॉपी किया गया',
    Failed: 'कॉपी करने में विफल, कृपया क्लिपबोर्ड तक पहुँच की अनुमति दें',
  },
  Context: {
    Toast: (x: any) => `${x} संदर्भ प्रॉम्प्ट के साथ`,
    Edit: 'संदर्भ और मेमोरी प्रॉम्प्ट संपादित करें',
    Add: 'जोड़ें',
  },
  Plugin: {
    Name: 'प्लगइन',
  },
  Mask: {
    Name: 'मास्क',
    Page: {
      Title: 'प्रॉम्प्ट टेम्पलेट',
      SubTitle: (count: number) => `${count} प्रॉम्प्ट टेम्पलेट`,
      Search: 'टेम्पलेट खोजें',
      Create: 'बनाएँ',
    },
    Item: {
      Info: (count: number) => `${count} प्रॉम्प्ट`,
      Chat: 'चैट',
      View: 'देखें',
      Edit: 'संपादित करें',
      Delete: 'हटाएँ',
      DeleteConfirm: 'हटाने की पुष्टि करें?',
    },
    EditModal: {
      Title: (readonly: boolean) => `प्रॉम्प्ट टेम्पलेट संपादित करें ${readonly ? '(केवल पढ़ने के लिए)' : ''}`,
      Download: 'डाउनलोड',
      Clone: 'क्लोन',
    },
    Config: {
      Avatar: 'बॉट अवतार',
      Name: 'बॉट नाम',
    },
  },
  NewChat: {
    Return: 'वापस जाएँ',
    Skip: 'छोड़ें',
    Title: 'एक मास्क चुनें',
    SubTitle: 'मास्क के पीछे की आत्मा के साथ चैट करें',
    More: 'और ढूंढें',
    NotShow: 'फिर से न दिखाएँ',
    ConfirmNoShow: 'अक्षम करने की पुष्टि करें? आप इसे बाद में सेटिंग्स में फिर से सक्षम कर सकते हैं।',
  },

  UI: {
    Confirm: 'पुष्टि करें',
    Cancel: 'रद्द करें',
    Close: 'बंद करें',
    Create: 'बनाएँ',
    Edit: 'संपादित करें',
  },
  Exporter: {
    Model: 'मॉडल',
    Messages: 'संदेश',
    Topic: 'विषय',
    Time: 'समय',
  },
};

export default hnd;
