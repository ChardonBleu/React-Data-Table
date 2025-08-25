import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { DataTable } from './index'
import { type MockFontAwesomeIconProps } from '../../test/mocks'
import userEvent from '@testing-library/user-event'

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
  ['Ivy', 'Taylor', 'Designer', '2024-03-07'],
  ['Jack', 'Thomas', 'Analyst', '2022-10-21'],
]
const testHeaders = ['First Name', 'Last Name', 'Position', 'Start Date']

beforeEach(() => {
  vi.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ iconName, ...props }: MockFontAwesomeIconProps) => (
      <span
        data-testid='font-awesome-icon'
        data-icon={iconName}
        {...props}
      />
    ),
  }))
})

describe('When DataTable component is displayed with invalid datas', () => {
  it('should render error message "Doonées invalides"', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={['First Name', 'Last Name', 'Position']}
        title='Table title'
      />
    )
    const result = screen.getByText('Données invalides')
    expect(result).toBeInTheDocument()
  })
})

describe('When DataTable component is displayed with datas and headers:', () => {
  it('should render component with title', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )

    const title = screen.getByText('Table title')
    expect(title).toBeInTheDocument()
  })
  it('should render component with headers', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )

    const firstNameHeader = screen.getByText('First Name')
    expect(firstNameHeader).toBeInTheDocument()

    const lastNameHeader = screen.getByText('Last Name')
    expect(lastNameHeader).toBeInTheDocument()

    const positionHeader = screen.getByText('Position')
    expect(positionHeader).toBeInTheDocument()

    const startDateHeader = screen.getByText('Start Date')
    expect(startDateHeader).toBeInTheDocument()
  })

  it('should render component with header', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )

    const title = screen.getByText('Table title')
    const section = title.parentElement

    const tableHeader = section?.querySelectorAll('thead tr th')
    expect(tableHeader?.length).toEqual(testHeaders.length)

    const fristHeader = tableHeader && tableHeader[0]
    expect(fristHeader).toHaveTextContent('First Name')
  })

  it('should render component with employee list', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )

    const title = screen.getByText('Table title')
    const section = title.parentElement

    const tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10) // by default page one shows 10 entries

    const fristRow = tableRows && tableRows[0]
    const firstRowFirstName = fristRow?.querySelector('td')
    expect(firstRowFirstName?.innerHTML).toEqual('John')
  })

  it('should render item per page select', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )

    const itemPerPage = screen.getByTestId('item-per-page')
    expect(itemPerPage.innerHTML).toEqual('10')

    const itemPerPageSelect = screen.getByTestId('item-per-page-select')
    expect(itemPerPageSelect).toBeInTheDocument()

    fireEvent.click(itemPerPageSelect)

    const option50 = screen.getByTestId('option50')
    const options = option50?.parentElement?.children
    expect(options?.length).toEqual(4)
  })
})

describe('When user click on item per page option 50', () => {
  it('should display new item per page', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const selectDown = screen.getByTestId('item-per-page-select')
    fireEvent.click(selectDown)

    const option50 = screen.getByTestId('option50')
    fireEvent.click(option50)

    const itemPerPage = screen.getByTestId('item-per-page').innerHTML
    expect(itemPerPage).toEqual('50')
  })
  it('should display new list', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )

    const selectDown = screen.getByTestId('item-per-page-select')
    fireEvent.click(selectDown)

    const option50 = screen.getByTestId('option50')
    fireEvent.click(option50)

    const title = screen.getByText('Table title')
    const section = title.parentElement

    const tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(12) // The whole 12 entries
  })
  it('should display just one page button instead of two', () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )

    const allPageButtons = screen.getAllByTestId('page-button')
    expect(allPageButtons.length).toEqual(2)

    const selectDown = screen.getByTestId('item-per-page-select')
    fireEvent.click(selectDown)

    const option50 = screen.getByTestId('option50')
    fireEvent.click(option50)

    const newAllPageButtons = screen.getAllByTestId('page-button')
    expect(newAllPageButtons.length).toEqual(1)
  })
})

describe('When user filter entries', () => {
  it('should display new filtered list', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const title0 = screen.getByText('Table title')
    const section0 = title0.parentElement
    const tableRows0 = section0?.querySelectorAll('tbody tr')
    expect(tableRows0?.length).toEqual(10)

    const inputFilter = screen.getByTestId('input-filter')
    await user.type(inputFilter, 'J')

    const title1 = screen.getByText('Table title')
    const section1 = title1.parentElement
    const tableRows1 = section1?.querySelectorAll('tbody tr')
    expect(tableRows1?.length).toEqual(4)

    await user.type(inputFilter, 'o')

    const title2 = screen.getByText('Table title')
    const section2 = title2.parentElement
    const tableRows2 = section2?.querySelectorAll('tbody tr')
    expect(tableRows2?.length).toEqual(2)

    await user.clear(inputFilter)

    const title3 = screen.getByText('Table title')
    const section3 = title3.parentElement
    const tableRows3 = section3?.querySelectorAll('tbody tr')
    expect(tableRows3?.length).toEqual(10)
  })
})

describe('When user sort entries by string', () => {
  it('should display new sorted list', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const sortByFirstNameButton = screen.getByTestId('sort0')

    // Initial list
    const title = screen.getByText('Table title')
    const section = title.parentElement
    const tableRows = section?.querySelectorAll('tbody tr')
    const firstRowFirstName = tableRows ? tableRows[0].querySelector('td') : null
    const lastRowFirstName = tableRows ? tableRows[9].querySelector('td') : null
    expect(firstRowFirstName?.innerHTML).toEqual('John')
    expect(lastRowFirstName?.innerHTML).toEqual('Henry')

    // ascendent sorting
    fireEvent.click(sortByFirstNameButton)

    let titleAfterSorting = screen.getByText('Table title')
    let sectionAfterSorting = titleAfterSorting.parentElement
    let tableRowsAfterSorting = sectionAfterSorting?.querySelectorAll('tbody tr')
    let sortedFirstRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[0].querySelector('td')
      : null
    let sortedLastRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[9].querySelector('td')
      : null
    expect(sortedFirstRowFirstName?.innerHTML).toEqual('Alice')
    expect(sortedLastRowFirstName?.innerHTML).toEqual('Jack')

    //descendent sorting
    fireEvent.click(sortByFirstNameButton)

    titleAfterSorting = screen.getByText('Table title')
    sectionAfterSorting = titleAfterSorting.parentElement
    tableRowsAfterSorting = sectionAfterSorting?.querySelectorAll('tbody tr')
    sortedFirstRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[0].querySelector('td')
      : null
    sortedLastRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[9].querySelector('td')
      : null
    expect(sortedFirstRowFirstName?.innerHTML).toEqual('John')
    expect(sortedLastRowFirstName?.innerHTML).toEqual('Charlie')
  })
})

describe('When user sort entries by date', () => {
  it('should display new sorted list', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const sortByDateButton = screen.getByTestId('sort3')

    // Initial list
    const title = screen.getByText('Table title')
    const section = title.parentElement
    const tableRows = section?.querySelectorAll('tbody tr')
    const firstRowFirstName = tableRows ? tableRows[0].querySelector('td') : null
    const lastRowFirstName = tableRows ? tableRows[9].querySelector('td') : null
    expect(firstRowFirstName?.innerHTML).toEqual('John')
    expect(lastRowFirstName?.innerHTML).toEqual('Henry')

    // ascendent sorting
    fireEvent.click(sortByDateButton)

    let titleAfterSorting = screen.getByText('Table title')
    let sectionAfterSorting = titleAfterSorting.parentElement
    let tableRowsAfterSorting = sectionAfterSorting?.querySelectorAll('tbody tr')
    let sortedFirstRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[0].querySelector('td')
      : null
    let sortedLastRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[9].querySelector('td')
      : null
    expect(sortedFirstRowFirstName?.innerHTML).toEqual('Henry')
    expect(sortedLastRowFirstName?.innerHTML).toEqual('Frank')

    //descendent sorting
    fireEvent.click(sortByDateButton)

    titleAfterSorting = screen.getByText('Table title')
    sectionAfterSorting = titleAfterSorting.parentElement
    tableRowsAfterSorting = sectionAfterSorting?.querySelectorAll('tbody tr')
    sortedFirstRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[0].querySelector('td')
      : null
    sortedLastRowFirstName = tableRowsAfterSorting
      ? tableRowsAfterSorting[9].querySelector('td')
      : null
    expect(sortedFirstRowFirstName?.innerHTML).toEqual('Ivy')
    expect(sortedLastRowFirstName?.innerHTML).toEqual('John')
  })
})

describe('When user click on next page button', () => {
  it('should display page two with 2 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const nextPageButton = screen.getByTestId('nextPageButton')

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)

    // go to page two
    fireEvent.click(nextPageButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)
  })
})

describe('When user click on last page button', () => {
  it('should display page two with 2 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const lastPageButton = screen.getByTestId('lastPageButton')

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)

    // go to page two
    fireEvent.click(lastPageButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)
  })
})

describe('When user click on previous page button', () => {
  it('should display page one with 10 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const lastPageButton = screen.getByTestId('lastPageButton')
    fireEvent.click(lastPageButton)

    const previousPageButton = screen.getByTestId('previousPageButton')

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)

    // go to page two
    fireEvent.click(previousPageButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)
  })
})

describe('When user click on first page button', () => {
  it('should display page one with 10 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const lastPageButton = screen.getByTestId('lastPageButton')
    fireEvent.click(lastPageButton)

    const previousPageButton = screen.getByTestId('firstPageButton')

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)

    // go to page two
    fireEvent.click(previousPageButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)
  })
})

describe('When user is on page two and click on page number one', () => {
  it('should display page one with 10 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const lastPageButton = screen.getByTestId('lastPageButton')
    fireEvent.click(lastPageButton)

    const pageOneButton = screen.getAllByTestId('page-button')[0]

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)

    // go to page two
    fireEvent.click(pageOneButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)
  })
})

describe('When user is on page one and click on page number two', () => {
  it('should display page two with 2 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const pageTwoButton = screen.getAllByTestId('page-button')[1]

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)

    // go to page two
    fireEvent.click(pageTwoButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)
  })
})

describe('When user is on page one and click on previous page button', () => {
  it('should still display page one with 10 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const previousPageButton = screen.getByTestId('previousPageButton')

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)

    // go to page two
    fireEvent.click(previousPageButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(10)
  })
})

describe('When user is on page two and click on next page button', () => {
  it('should still display page two with 2 entries ', async () => {
    render(
      <DataTable
        datas={testData}
        tableHeaders={testHeaders}
        title='Table title'
      />
    )
    const lastPageButton = screen.getByTestId('lastPageButton')
    fireEvent.click(lastPageButton)

    const nextPageButton = screen.getByTestId('nextPageButton')

    // Initial list
    let title = screen.getByText('Table title')
    let section = title.parentElement
    let tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)

    // go to page two
    fireEvent.click(nextPageButton)

    title = screen.getByText('Table title')
    section = title.parentElement
    tableRows = section?.querySelectorAll('tbody tr')
    expect(tableRows?.length).toEqual(2)
  })
})
