import type {PartialLocaleType} from './index';

const trk: PartialLocaleType = {
  WIP: 'Devam ediyor...',
  Error: {
    Unauthorized: 'Yetkisiz erişim, lütfen ayarlar sayfasında erişim kodunu girin.',
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} mesaj`,
  },
  Chat: {
    SubTitle: (count: number) => `ChatGPT ile ${count} mesaj`,
    Actions: {
      ChatList: 'Sohbet listesine git',
      CompressedHistory: 'Sıkıştırılmış hafıza istemi',
      Export: 'Tüm mesajları Markdown olarak dışa aktar',
      Copy: 'Kopyala',
      Stop: 'Dur',
      Retry: 'Tekrar dene',
      Delete: 'Sil',
    },
    Rename: 'Sohbeti yeniden adlandır',
    Typing: 'Yazıyor...',
    Input: (submitKey: string) => {
      const inputHints = `${submitKey} ile gönder`;
      return inputHints;
    },
    InputPlaceholder: 'Herhangi bir şey sor',
    Send: 'Gönder',
    Config: {
      Reset: 'Varsayılana sıfırla',
      SaveAs: 'Maske olarak kaydet',
    },
  },
  Export: {
    Title: 'Tüm Mesajlar',
    Copy: 'Hepsini kopyala',
    Download: 'İndir',
    MessageFromYou: 'Sizin Mesajınız',
    MessageFromChatGPT: "ChatGPT'den Mesaj",
  },
  Memory: {
    Title: 'Hafıza İsteği',
    EmptyContent: 'Henüz bir şey yok.',
    Send: 'Hafızayı gönder',
    Copy: 'Hafızayı kopyala',
    Reset: 'Oturumu sıfırla',
    ResetConfirm:
      'Sıfırlama, mevcut sohbet geçmişini ve uzun süreli hafızayı siler. Gerçekten sıfırlamak istiyor musunuz?',
  },
  Home: {
    NewTicket: 'Yeni Sohbet',
    DeleteChat: 'Seçilen sohbeti silmek için onaylayın?',
    DeleteToast: 'Sohbet silindi',
    Revert: 'Geri al',
  },
  Settings: {
    Title: 'Ayarlar',
    SubTitle: 'Tüm ayarlar',
    Actions: {
      ClearAll: 'Tüm verileri sil',
      ResetAll: 'Tüm ayarları sıfırla',
      Close: 'Kapat',
      ConfirmResetAll: 'Tüm yapılandırmaları gerçekten sıfırlamak istiyor musunuz?',
      ConfirmClearAll: 'Tüm sohbetleri gerçekten sıfırlamak istiyor musunuz?',
    },
    Lang: {
      Name: 'Dil', // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: 'Tüm Diller',
    },
    Avatar: 'Avatar',
    FontSize: {
      Title: 'Yazı Boyutu',
      SubTitle: 'Sohbet içeriğinin yazı boyutunu ayarla',
    },
    Update: {
      Version: (x: string) => `Versiyon: ${x}`,
      IsLatest: 'En Son Sürüm',
      CheckUpdate: 'Güncellemeleri kontrol et',
      IsChecking: 'Güncelleme kontrol ediliyor...',
      FoundUpdate: (x: string) => `Yeni sürüm bulundu: ${x}`,
      GoToUpdate: 'Güncelle',
    },
    SendKey: 'Gönderme Tuşu',
    Theme: 'Tema',
    TightBorder: 'Dar Kenarlık',
    SendPreviewBubble: {
      Title: 'Önizleme Baloncuğu Gönder',
      SubTitle: "Markdown'u baloncukta önizle",
    },
    Mask: {
      Title: 'Maske Başlangıç Ekranı',
      SubTitle: 'Yeni sohbet başlatmadan önce bir maske başlangıç ekranı göster',
    },
    Prompt: {
      Disable: {
        Title: 'Otomatik tamamlamayı devre dışı bırak',
        SubTitle: '/ ile başlayarak otomatik tamamlamayı başlat',
      },
      List: 'İstek Listesi',
      ListCount: (builtin: number, custom: number) => `${builtin} yerleşik, ${custom} özel`,
      Edit: 'Düzenle',
      Modal: {
        Title: 'İstek Listesi',
        Add: 'Bir Tane Ekle',
        Search: 'İstekleri Ara',
      },
      EditModal: {
        Title: 'İstek Düzenle',
      },
    },
    HistoryCount: {
      Title: 'Eklenen Mesaj Sayısı',
      SubTitle: 'Her isteğe göre eklenen gönderilen mesaj sayısı',
    },
    CompressThreshold: {
      Title: 'Geçmiş Sıkıştırma Eşiği',
      SubTitle: 'Sıkıştırılmamış mesajların uzunluğu bu değeri aştığında sıkıştır',
    },
    Token: {
      Title: 'API Anahtarı',
      SubTitle: 'Erişim kodu limitini göz ardı etmek için anahtarınızı kullanın',
      Placeholder: 'OpenAI API Anahtarı',
    },
    Usage: {
      Title: 'Hesap Durumu',
      SubTitle(used: unknown, total: unknown) {
        return `Bu ay harcanan $${used}, Abonelik $${total}`;
      },
      IsChecking: 'Kontrol ediliyor...',
      Check: 'Tekrar kontrol et',
      NoAccess: 'Hesap durumunu kontrol etmek için API anahtarını girin',
    },
    AccessCode: {
      Title: 'Erişim Kodu',
      SubTitle: 'Erişim kontrolü etkin',
      Placeholder: 'Erişim kodu gereklidir',
    },
    Model: 'Model',
    Temperature: {
      Title: 'Sıcaklık',
      SubTitle: 'Daha büyük bir değer, daha rastgele yanıtlara yol açar',
    },
    MaxTokens: {
      Title: 'Maksimum Tokenler',
      SubTitle: 'İstek artı yanıt tokenlerinin maksimum sayısı',
    },
    PresencePenalty: {
      Title: 'Varlık Cezası',
      SubTitle: 'Daha yüksek bir değer, yeni konular hakkında konuşma olasılığını artırır',
    },
    FrequencyPenalty: {
      Title: 'Frekans Cezası',
      SubTitle: 'Daha yüksek bir değer, aynı satırın tekrarlanma olasılığını azaltır',
    },
  },
  Store: {
    DefaultTopic: 'Yeni Sohbet',
    BotHello: 'Merhaba! Bugün size nasıl yardımcı olabilirim?',
    Error: 'Bir şeyler yanlış gitti, lütfen daha sonra tekrar deneyin.',
    Prompt: {
      History: (content: string) =>
        'Bu, AI ile kullanıcı arasındaki sohbet geçmişinin bir özeti olarak gözden geçirme: ' + content,
      Topic:
        'Lütfen konuşmamızı özetleyen dört ila beş kelime uzunluğunda bir başlık oluşturun, giriş, noktalama işaretleri, tırnak işaretleri, noktalar, semboller veya ekstra metin olmadan. Tırnak işaretlerini kaldırın.',
      Summarize:
        'Gelecekteki sohbetler için bir istem olarak kullanılmak üzere tartışmamızı 200 kelime veya daha az bir özetle özetleyin.',
    },
  },
  Copy: {
    Success: 'Panoya kopyalandı',
    Failed: 'Kopyalama başarısız oldu, lütfen panoya erişim iznini verin',
  },
  Context: {
    Toast: (x: unknown) => `${x} bağlam istemleri ile`,
    Edit: 'Bağlam ve hafıza istemlerini düzenle',
    Add: 'Ekle',
  },
  Plugin: {
    Name: 'Eklenti',
  },
  Mask: {
    Name: 'Maske',
    Page: {
      Title: 'İstem Şablonu',
      SubTitle: (count: number) => `${count} istem şablonu`,
      Search: 'Şablonları Ara',
      Create: 'Oluştur',
    },
    Item: {
      Info: (count: number) => `${count} istem`,
      Chat: 'Sohbet',
      View: 'Görüntüle',
      Edit: 'Düzenle',
      Delete: 'Sil',
      DeleteConfirm: 'Silmek için onayla?',
    },
    EditModal: {
      Title: (readonly: boolean) => `İstem Şablonunu Düzenle ${readonly ? '(salt okunur)' : ''}`,
      Download: 'İndir',
      Clone: 'Klonla',
    },
    Config: {
      Avatar: 'Bot Avatarı',
      Name: 'Bot Adı',
    },
  },
  NewChat: {
    Return: 'Geri Dön',
    Skip: 'Atla',
    Title: 'Bir Maske Seç',
    SubTitle: 'Maske arkasındaki ruhla sohbet et',
    More: 'Daha Fazla Bul',
    NotShow: 'Tekrar Gösterme',
    ConfirmNoShow: 'Devre dışı bırakmak için onayla? Ayarlardan daha sonra tekrar etkinleştirebilirsiniz.',
  },

  UI: {
    Confirm: 'Onayla',
    Cancel: 'İptal',
    Close: 'Kapat',
    Create: 'Oluştur',
    Edit: 'Düzenle',
  },
  Exporter: {
    Model: 'Model',
    Messages: 'Mesajlar',
    Topic: 'Konu',
    Time: 'Zaman',
  },
};

export default trk;
