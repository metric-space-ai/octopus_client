import type {PartialLocaleType} from './index';

const fa: PartialLocaleType = {
  WIP: 'در حال انجام...',
  Error: {
    Unauthorized: 'دسترسی غیرمجاز، لطفا کد دسترسی را در صفحه تنظیمات وارد کنید.',
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} پیام`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} پیام با ChatGPT`,
    Actions: {
      ChatList: 'رفتن به لیست چت',
      CompressedHistory: 'پرامپت حافظه فشرده',
      Export: 'صادر کردن تمام پیام‌ها به صورت Markdown',
      Copy: 'کپی',
      Stop: 'توقف',
      Retry: 'تلاش مجدد',
      Delete: 'حذف',
    },
    Rename: 'تغییر نام چت',
    Typing: 'در حال تایپ...',
    Input: (submitKey: string) => {
      const inputHints = `${submitKey} برای ارسال`;
      return inputHints;
    },
    InputPlaceholder: 'هر سوالی دارید بپرسید',
    Send: 'ارسال',
    Config: {
      Reset: 'بازنشانی به پیش‌فرض',
      SaveAs: 'ذخیره به عنوان ماسک',
    },
  },
  Export: {
    Title: 'تمام پیام‌ها',
    Copy: 'کپی همه',
    Download: 'دانلود',
    MessageFromYou: 'پیام شما',
    MessageFromChatGPT: 'پیام از ChatGPT',
  },
  Memory: {
    Title: 'پرامپت حافظه',
    EmptyContent: 'هنوز چیزی نیست.',
    Send: 'ارسال حافظه',
    Copy: 'کپی حافظه',
    Reset: 'بازنشانی جلسه',
    ResetConfirm:
      'بازنشانی، تاریخچه گفتگوی فعلی و حافظه بلندمدت را پاک می‌کند. واقعا می‌خواهید بازنشانی کنید؟',
  },
  Home: {
    NewTicket: 'چت جدید',
    DeleteChat: 'برای حذف گفتگوی انتخاب شده تأیید کنید؟',
    DeleteToast: 'چت حذف شد',
    Revert: 'بازگشت',
  },
  Settings: {
    Title: 'تنظیمات',
    SubTitle: 'همه تنظیمات',
    Actions: {
      ClearAll: 'پاک کردن همه داده‌ها',
      ResetAll: 'بازنشانی همه تنظیمات',
      Close: 'بستن',
      ConfirmResetAll: 'واقعا می‌خواهید همه تنظیمات را بازنشانی کنید؟',
      ConfirmClearAll: 'واقعا می‌خواهید همه چت‌ها را بازنشانی کنید؟',
    },
    Lang: {
      Name: 'زبان', // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: 'همه زبان‌ها',
    },
    Avatar: 'آواتار',
    FontSize: {
      Title: 'اندازه قلم',
      SubTitle: 'تنظیم اندازه قلم محتوای چت',
    },
    Update: {
      Version: (x: string) => `نسخه: ${x}`,
      IsLatest: 'آخرین نسخه',
      CheckUpdate: 'بررسی بروزرسانی',
      IsChecking: 'در حال بررسی بروزرسانی...',
      FoundUpdate: (x: string) => `نسخه جدید یافت شد: ${x}`,
      GoToUpdate: 'بروزرسانی',
    },
    SendKey: 'کلید ارسال',
    Theme: 'ظاهر',
    TightBorder: 'حاشیه تنگ',
    SendPreviewBubble: {
      Title: 'فرستادن حباب پیش‌نمایش',
      SubTitle: 'پیش‌نمایش markdown در حباب',
    },
    Mask: {
      Title: 'ماسک صفحه آغازین',
      SubTitle: 'نمایش یک صفحه آغازین ماسک قبل از شروع چت جدید',
    },
    Prompt: {
      Disable: {
        Title: 'غیرفعال‌سازی خودکار',
        SubTitle: 'شروع خودکار با /',
      },
      List: 'لیست پرامپت',
      ListCount: (builtin: number, custom: number) => `${builtin} داخلی، ${custom} سفارشی`,
      Edit: 'ویرایش',
      Modal: {
        Title: 'لیست پرامپت',
        Add: 'اضافه کردن یکی',
        Search: 'جستجوی پرامپت‌ها',
      },
      EditModal: {
        Title: 'ویرایش پرامپت',
      },
    },
    HistoryCount: {
      Title: 'تعداد پیام‌های پیوست شده',
      SubTitle: 'تعداد پیام‌های ارسالی درخواست شده به ازای هر پرسش',
    },
    CompressThreshold: {
      Title: 'آستانه فشرده‌سازی تاریخچه',
      SubTitle: 'فشرده‌سازی هنگامی که طول پیام‌های غیرفشرده این مقدار را پشت سر می‌گذارد',
    },
    Token: {
      Title: 'کلید API',
      SubTitle: 'از کلید خود برای نادیده گرفتن محدودیت کد دسترسی استفاده کنید',
      Placeholder: 'کلید API OpenAI',
    },
    Usage: {
      Title: 'موجودی حساب',
      SubTitle(used: any, total: any) {
        return `این ماه استفاده شده $${used}, اشتراک $${total}`;
      },
      IsChecking: 'در حال بررسی...',
      Check: 'بررسی مجدد',
      NoAccess: 'برای بررسی موجودی، کلید API را وارد کنید',
    },
    AccessCode: {
      Title: 'کد دسترسی',
      SubTitle: 'کنترل دسترسی فعال شده',
      Placeholder: 'نیاز به کد دسترسی',
    },
    Model: 'مدل',
    Temperature: {
      Title: 'دما',
      SubTitle: 'مقدار بزرگتر به پاسخ‌های تصادفی‌تر منجر می‌شود',
    },
    MaxTokens: {
      Title: 'حداکثر توکن‌ها',
      SubTitle: 'حداکثر تعداد توکن‌های درخواستی به علاوه پاسخ',
    },
    PresencePenalty: {
      Title: 'جریمه حضور',
      SubTitle: 'مقدار بیشتر، احتمال بحث در مورد موضوعات جدید را افزایش می‌دهد',
    },
    FrequencyPenalty: {
      Title: 'جریمه فرکانس',
      SubTitle: 'مقدار بیشتر، احتمال تکرار همان خط را کاهش می‌دهد',
    },
  },
  Store: {
    DefaultTopic: 'گفتگوی جدید',
    BotHello: 'سلام! چطور می‌توانم به شما کمک کنم؟',
    Error: 'مشکلی پیش آمده است، لطفا بعدا دوباره تلاش کنید.',
    Prompt: {
      History: (content: string) =>
        'این خلاصه‌ای از تاریخچه چت بین هوش مصنوعی و کاربر است: ' + content,
      Topic:
        'لطفا عنوانی چهار تا پنج کلمه‌ای ایجاد کنید که گفتگوی ما را خلاصه کند، بدون مقدمه، علائم نگارشی، نقل قول‌ها، نقطه‌ها، نمادها یا متن اضافی. نقل قول‌ها را حذف کنید.',
      Summarize:
        'بحث ما را به طور خلاصه در ۲۰۰ کلمه یا کمتر خلاصه کنید تا به عنوان پرامپت برای گفتگوهای آینده استفاده شود.',
    },
  },
  Copy: {
    Success: 'در کلیپ‌بورد کپی شد',
    Failed: 'کپی نشد، لطفا دسترسی به کلیپ‌بورد را اجازه دهید',
  },
  Context: {
    Toast: (x: any) => `با ${x} پرامپت‌های زمینه‌ای`,
    Edit: 'ویرایش پرامپت‌های زمینه‌ای و حافظه',
    Add: 'اضافه کردن',
  },
  Plugin: {
    Name: 'پلاگین',
  },
  Mask: {
    Name: 'ماسک',
    Page: {
      Title: 'قالب پرامپت',
      SubTitle: (count: number) => `${count} قالب پرامپت`,
      Search: 'جستجوی قالب‌ها',
      Create: 'ایجاد',
    },
    Item: {
      Info: (count: number) => `${count} پرامپت`,
      Chat: 'چت',
      View: 'مشاهده',
      Edit: 'ویرایش',
      Delete: 'حذف',
      DeleteConfirm: 'برای حذف تأیید کنید؟',
    },
    EditModal: {
      Title: (readonly: boolean) => `ویرایش قالب پرامپت ${readonly ? '(فقط خواندنی)' : ''}`,
      Download: 'دانلود',
      Clone: 'کلون',
    },
    Config: {
      Avatar: 'آواتار ربات',
      Name: 'نام ربات',
    },
  },
  NewChat: {
    Return: 'بازگشت',
    Skip: 'رد کردن',
    Title: 'انتخاب یک ماسک',
    SubTitle: 'چت با روح پشت ماسک',
    More: 'یافتن بیشتر',
    NotShow: 'دوباره نشان نده',
    ConfirmNoShow: 'برای غیرفعال سازی تأیید کنید؟ بعدا می‌توانید در تنظیمات فعالش کنید.',
  },

  UI: {
    Confirm: 'تأیید',
    Cancel: 'لغو',
    Close: 'بستن',
    Create: 'ایجاد',
    Edit: 'ویرایش',
  },
  Exporter: {
    Model: 'مدل',
    Messages: 'پیام‌ها',
    Topic: 'موضوع',
    Time: 'زمان',
  },
};

export default fa;
