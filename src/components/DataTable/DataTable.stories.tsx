import type { Meta, StoryObj } from '@storybook/react-vite'
import { DataTable } from './'

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      description: 'Thème personnalisé pour le tableau',
      control: 'object',
    },
    title: {
      description: 'Titre optionnel du tableau',
      control: 'text',
    },
    datas: {
      description: 'Données du tableau (tableau de tableaux)',
      control: 'object',
    },
    tableHeaders: {
      description: 'En-têtes des colonnes',
      control: 'object',
    },
  },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

const sampleData = [
  ['John', 'Doe', 'Manager', '2020-01-15'],
  ['Jane', 'Smith', 'Developer', '2021-03-22'],
  ['Bob', 'Johnson', 'Designer', '2019-11-08'],
  ['Alice', 'Brown', 'Analyst', '2022-05-10'],
  ['Charlie', 'Wilson', 'Developer', '2021-08-17'],
  ['Diana', 'Davis', 'Manager', '2020-09-03'],
  ['Eve', 'Miller', 'Designer', '2023-01-12'],
  ['Frank', 'Garcia', 'Analyst', '2022-12-05'],
  ['Grace', 'Martinez', 'Developer', '2021-06-28'],
  ['Henry', 'Anderson', 'Manager', '2019-04-14'],
  ['Ivy', 'Taylor', 'Designer', '2023-03-07'],
  ['Jack', 'Thomas', 'Analyst', '2022-10-21'],
]

const headers = ['First Name', 'Last Name', 'Position', 'Start Date']

export const Default: Story = {
  args: {
    datas: sampleData.slice(0, 4),
    tableHeaders: headers,
  },
}

export const WithTitle: Story = {
  args: {
    datas: sampleData.slice(0, 6),
    tableHeaders: headers,
    title: 'Employee Directory',
  },
}

export const WithPersonnalTheme: Story = {
  args: {
    datas: sampleData,
    tableHeaders: headers,
    title: 'Custom Themed Table',
    theme: {
      primaryColor: '#1b1a1af8',
      backgroundColor: '#e0d6c7ff',
      accentColor: '#269e4aff',
    },
  },
}

export const LargeDataset: Story = {
  args: {
    datas: sampleData,
    tableHeaders: headers,
    title: 'Large Dataset Example',
  },
}

export const MinimalData: Story = {
  args: {
    datas: [
      ['Marianne', 'Durand'],
      ['Jean', 'Dupont'],
    ],
    tableHeaders: ['First Name', 'Last Name'],
  },
}
