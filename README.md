# React-Data-Table
React component: data table with pagination, filtering and sorting


## Development:

### Installation

You can clone the whole project by doing:

```bash
git clone https://github.com/ChardonBleu/React-Data-Table
```

Install the dependencies:

```bash
npm install
```

### Project structure:

```
.
├── .storybook
│ ├── min.ts
│ ├── preview.ts
├── src
│ ├── App.jsx
│ ├── components
│ │ ├── DataTable
│ │ │ ├── DataTable.stories.tsx
│ │ │ ├── DataTable.test.tsx
│ │ │ ├── index.tsx
│ │ │ ├── styles.module.css
│ │ │ ├── type.d.ts
│ ├── stories
│ │ ├── assets
│ │ └── Configure.mdx
│ ├── test
│ │ ├── mocks.tsx
│ │ ├── setup.ts
│ ├── main.ts
│ └── vite.env.d.ts
└── .browserslistrc
└── .gitignore
└── .prettierignore
└── .prettierrc
└── .stylelintignore
└── .stylelintrc.mjs
└── eslint.config.js
└── package-lock.json
└── package.json
└── postcss.config.cjs
└── README.md
└── tsconfig.app.json
└── tsconfig.json
└── tsconfig.node.json
└── vite.config.ts
└── vitest.shims.d.ts
```

### development tools:

Linter:
```bash
npm run lint --fix
```

Prettier:
```bash
npm run fmt --fix
```

Style linter:
```bash
npm run stylelint --fix
```

### Launching tests:

```bash
npm run test
```
Tests reports and coverage are on : http://localhost:51204/__vitest__/#/

### Building and Launching storybook:

build storybook:
```bash
npm run build-storybook
```

Launch storybook:
```bash
npm run storybook
```
Local: http://localhost:6006/  
On your network:  http://192.168.1.35:6006/   

## Production:

```bash
npm run build
```

## Component usage:

Entries length must all be the same,  
 and tableHeaders length must be equal to entries length.  
 User can:   
    -filter entries,  
    -sort entries by each table column  
    -schoose number of entries per pages  
 
  ### Usage  
 
  ```jsx
 
  const employeeList = [["Marianne", "Durand"], ["Jean", "Dupont"]]
  const headersList = ["First Name", "Last Name"]
  const theme = {primaryColor: '#000000', backgroundColor: '#bfcedd', accentColor: '#3c56e7'}
 
  <DataTable
     datas={employeesList}
     tableHeaders={headersList}
     title="Table title"
     theme={theme}
  />
 
  ```

  ### Rendering with personnal theme

  ![HRNet](src/stories/assets/DataTableExample.png)