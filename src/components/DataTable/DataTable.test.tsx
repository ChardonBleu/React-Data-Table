import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'
import { DataTable } from './index'

const testData = [
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
const testHeaders = ['First Name', 'Last Name', 'Position', 'Start Date']

describe("DataTable test:", () => {
    afterEach(cleanup)

    it("should render component", () => {
        render(<DataTable datas={testData} headers={testHeaders} title="Table title" />)
        const title = screen.getByText("Table title")
        expect(title).toBeInTheDocument()
    })
})
