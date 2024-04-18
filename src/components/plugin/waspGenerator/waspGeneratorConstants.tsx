import {TDirectories} from './waspGeneratorTypes';

export const CreativityLevel = ['Creative', 'Balanced', 'Conventional'];
export const AuthMethods = [
  {label: 'Email & Password', value: 'Email&Password'},
  {label: 'Username & Password', value: 'Username&Password'},
  {label: 'Social Auth', value: 'SocialAuth'},
];
export const GENERATINGAPPSTEPS = {First: 1, Second: 2, Third: 3};
export const DIRECTORIES: TDirectories[] = [
  {
    type: 'file',
    name: 'main.wasp',
  },
  {
    type: 'file',
    name: 'postcss.config.cjs',
  },
  {
    type: 'file',
    name: 'tailwind.config.cjs',
  },
  {
    type: 'directory',
    name: 'src',
  },
  {
    type: 'directory',
    name: 'client',
  },
  {
    type: 'file',
    name: 'Layout.jsx',
  },
  {
    type: 'file',
    name: 'Main.css',
  },
  {
    type: 'directory',
    name: 'pages',
  },
  {
    type: 'file',
    name: 'ssLayout.jsx',
  },
  {
    type: 'file',
    name: 'ssMain.css',
  },
  {
    type: 'directory',
    name: 'sspages',
  },
];

export const JOBS = [
  '⌛️ Generating project skeleton...',
  '⌛️ Generating pages...',
  'Imports in pages fixed.',
  'Fixing imports in pages',
];

export const FILEVIEW = {
  fileName: 'main.wasp',
  content: `app TodoApp {
wasp: {
    version: "^0.13.0"
},
title: "TodoApp",
client: {
    rootComponent: import { Layout } from "@src/Layout.jsx"
},
db: {
    prisma: {
        clientPreviewFeatures: ["extendedWhereUnique"]
    }
},
auth: {
    userEntity: User,
    methods: {
        usernameAndPassword: {}
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/"
    }
}

route LoginRoute { path: "/login", to: LoginPage }
page LoginPage {
    component: import Login from "@src/pages/auth/Login.jsx"
}
route SignupRoute { path: "/signup", to: SignupPage }
page SignupPage {
    component: import Signup from "@src/pages/auth/Signup.jsx"
}

entity User {=psl
    id    Int    @id @default(autoincrement())
    tasks Task[]
psl=}

entity Task {=psl
    id          Int     @id @default(autoincrement())
    description String
    isDone      Boolean @default(false)
    user        User    @relation(fields: [userId], references: [id])
    userId      Int
psl=}

action createTask {
    fn: import { createTask } from "@src/actions.js",
    entities: [Task]
}

action toggleTask {
    fn: import { toggleTask } from "@src/actions.js",
    entities: [Task]
}

action updateTask {
    fn: import { updateTask } from "@src/actions.js",
    entities: [Task]
}

query getTasks {
    fn: import { getTasks } from "@src/queries.js",
    entities: [Task]
}

route DashboardRoute { path: "/", to: DashboardPage }
page DashboardPage {
    component: import DashboardPage from "@src/pages/Dashboard.jsx",
    authRequired: true
}
`,
};
