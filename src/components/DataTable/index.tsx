import { useEffect, useState, type MouseEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faSort,
  faBackwardFast,
  faBackwardStep,
  faForwardFast,
  faForwardStep,
} from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import styles from './styles.module.css'

interface ThemeType {
  primaryColor: string
  backgroundColor: string
  accentColor: string
}
interface DataTableType {
  datas: Array<Array<string>>
  tableHeaders: Array<string>
  tableTitle?: string
  theme?: ThemeType
}

const defaultTheme = {
  primaryColor: '#000000',
  backgroundColor: '#bfcedd',
  accentColor: '#3c56e7',
}

const OPTIONS_VALUES = [10, 25, 50, 100]

/**
 * # React-Data-Table component
 * ### Généric table for data array.
 * Entries length must all be the same,
 * and tableHeaders length must be equal to entries length.
 * User can:
 *    -filter entries,
 *    -sort entries by each table column
 *    -schoose number of entries per pages
 * @param {DataTableType} props - component props
 * @param {Array<Array<string>>} props.datas - array of table entries. Each entrie is an array
 * @param {Array<string>} props.tableHeaders - array of table head titles
 * @param {string} props.tableTitle - optional - table title
 * @param {ThemeType} props.theme - optional - css theme with colors
 * @param {string} props.theme.primaryColor - text and borders color
 * @param {string} props.theme.backgroundColor - background for alternates rows and page buttons
 * @param {string} props.theme.accentColor - active buttons and underline
 * @retrun {ReactElement}
 *
 * ### Usage
 *
 * ```jsx
 *
 * const employeeList = [["Marianne", "Durand"], ["Jean", "Dupont"]]
 * const headersList = ["First Name", "Last Name"]
 * const theme = {primaryColor: '#000000', backgroundColor: '#bfcedd', accentColor: '#3c56e7'}
 *
 * <DataTable
 *    datas={employeesList}
 *    tableHeaders={headersList}
 *    title="Table title"
 *    theme={theme}
 * />
 *
 * ```
 */
export function DataTable({ datas, tableHeaders, tableTitle, theme }: DataTableType) {
  const [sortedDatas, setSortedDatas] = useState<Array<Array<string>>>([])
  const [displayedDatas, setDisplayedDatas] = useState<Array<Array<string>>>([])
  const [itemPerPage, setItemPerPage] = useState<number>(10)
  const [isSorted, setIsSorted] = useState<boolean[]>([])
  const [PagesButtons, setPagesButtons] = useState<Array<number>>([])
  const [activePage, setActivePage] = useState<number>(1)
  const [numberOfEntries, setnumberOfEntries] = useState<number>(0)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const finalTheme = { ...defaultTheme, ...theme }
  const styleVariables: React.CSSProperties = {
    '--table-primary': finalTheme.primaryColor,
    '--table-background': finalTheme.backgroundColor,
    '--table-accent': finalTheme.accentColor,
  }

  /**
   * This useEffect check datas changes.
   * Then sortedDatas, numberOfEntries and isSorted are initialized.
   */
  useEffect(() => {
    setSortedDatas(datas)
    setnumberOfEntries(datas.length)
    setIsSorted(new Array(tableHeaders.length).fill(false))
  }, [datas, tableHeaders.length])

  /**
   * This useEffect checks if sortedDatas change.
   * It can change when user sorts data with buttons in TableHeaders.
   * Then displayed datas have to change.
   *
   * This useEffect also checks if activePage changes.
   * It can happen when user click on navigation pages buttons.
   *
   * And This useEffect checks if itemPerPage changes.
   * It can happen when user choose a number par page in select options.
   */
  useEffect(() => {
    setDisplayedDatas(sortedDatas.slice((activePage - 1) * itemPerPage, itemPerPage * activePage))
    const nbPages = Math.ceil(numberOfEntries / itemPerPage)
    setPagesButtons(Array.from({ length: nbPages }, (_, index) => index + 1))
  }, [sortedDatas, itemPerPage, activePage])

  /**
   * This use effect checks if numberOfEntries changes.
   * It can happen when use filter employees.
   */
  useEffect(() => {
    const nbPages = Math.ceil(numberOfEntries / itemPerPage)
    setPagesButtons(Array.from({ length: nbPages }, (_, index) => index + 1))
  }, [numberOfEntries])

  /**
   * Employee sorting.
   * When user click on a sorting button near to a table header title,
   * index of this header title in tableHeaders list is passed in parameters.
   * Exemple:
   * tableHeaders = ["First Name", "Last Name", "Start Date"]
   * If user clik to "Last Name" sorting button then  index = 1
   * beafore sorting we have isSorted = [false, false, false]
   * The result if  isSorted[index] determine sorting  direction.
   * After sorting we have isSorted = [false, true, false]
   *
   * @param index tableHeaders index
   */
  function handleSort(index: number) {
    if (tableHeaders[index].toLowerCase().includes('date')) {
      const sorted = [...sortedDatas].sort((a, b) => {
        return isSorted[index]
          ? new Date(a[index]).getTime() - new Date(b[index]).getTime()
          : new Date(b[index]).getTime() - new Date(a[index]).getTime()
      })
      setSortedDatas(sorted)
      setDisplayedDatas(sorted.slice((activePage - 1) * itemPerPage, itemPerPage * activePage))
    } else {
      const sorted = [...sortedDatas].sort(function (a, b) {
        return isSorted[index] ? a[index].localeCompare(b[index]) : b[index].localeCompare(a[index])
      })
      setSortedDatas(sorted)
      setDisplayedDatas(sorted.slice((activePage - 1) * itemPerPage, itemPerPage * activePage))
    }
    const newIsSorted = [...isSorted]
    newIsSorted[index] = !newIsSorted[index]
    setIsSorted(newIsSorted)
  }

  /**
   * Employee filtering.
   * When user add characters in filter input new data list is created
   * and then number of entries and displayed list are updated.
   * Sorting datas are preserved.
   */
  function handleFilter() {
    const input = document.querySelector('input')
    if (input && input?.value.length > 0) {
      const newEmployeeList = sortedDatas.filter((data) =>
        data
          .map((item) => item.toLowerCase().includes(input.value.toLowerCase()))
          .reduce((acc, bool) => acc || bool)
      )
      setnumberOfEntries(newEmployeeList.length)
      setDisplayedDatas(
        newEmployeeList.slice((activePage - 1) * itemPerPage, itemPerPage * activePage)
      )
    } else {
      setnumberOfEntries(sortedDatas.length)
      setDisplayedDatas(sortedDatas.slice((activePage - 1) * itemPerPage, itemPerPage * activePage))
    }
  }

  /**
   * Show select button options to choose number of entries per page
   */
  function toggleOptions() {
    setShowOptions(!showOptions)
  }

  /**
   * Number of row per page selection
   * @param {MouseEvent<HTMLDivElement>} event
   */
  function handleSelect(event: MouseEvent<HTMLDivElement>) {
    const optionValue = event.currentTarget.innerText
    setItemPerPage(Number(optionValue))
    setShowOptions(false)
  }

  /**
   * Changing page with buttons page
   * @param event
   */
  function handleChangePage(event: MouseEvent<HTMLButtonElement>) {
    const currentPageButton = event.currentTarget
    setActivePage(Number(currentPageButton.innerText))
  }

  /**
   * Changing page with previous button |<
   */
  function handlePreviousPage() {
    if (activePage > 1) {
      setActivePage(activePage - 1)
    } else {
      setActivePage(1)
    }
  }

  /**
   * Changing page with next button >|
   */
  function handleNextPage() {
    const maxPage = PagesButtons.reduce((accumulator, currentValue) =>
      Math.max(accumulator, currentValue)
    )
    if (activePage < maxPage) {
      setActivePage(activePage + 1)
    } else {
      setActivePage(maxPage)
    }
  }

  if (!datas || !tableHeaders) {
    return <div>Données maquantes</div>
  } else if (!datas.map((entries) => entries.length).every((x) => x === tableHeaders.length)) {
    return <div>Données invalides</div>
  } else {
    return (
      <>
        <section
          className={styles['data-table']}
          style={styleVariables}
        >
          {tableTitle && <h2 className={styles.title}>{tableTitle}</h2>}

          <div className={styles.tools}>
            <div className={styles.pagination}>
              <div>Show</div>

              <div className={styles.select}>
                <div
                  className={styles.value}
                  onClick={toggleOptions}
                >
                  <p>{itemPerPage}</p>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={styles.fa}
                  />
                </div>
                <div className={clsx(styles.options, { [styles['show-options']]: showOptions })}>
                  {OPTIONS_VALUES.map((value) => (
                    <div
                      key={value}
                      className={styles.option}
                      onClick={(event) => handleSelect(event)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <div>entries</div>
            </div>

            <div className={styles.filter}>
              <label>Search: </label>
              <input
                type='text'
                placeholder='filter'
                name='filter'
                onChange={() => handleFilter()}
              />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                {tableHeaders?.map((header, index) => (
                  <th key={index}>
                    {header}{' '}
                    <FontAwesomeIcon
                      icon={faSort}
                      className={styles.fa}
                      onClick={() => handleSort(index)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedDatas.map((row, index) => (
                <tr
                  key={index}
                  className={styles.row}
                >
                  {row.map((item, itemIndex) => (
                    <td key={itemIndex}>{item}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.tools}>
            <p>
              Showing {(activePage - 1) * itemPerPage + 1} to{' '}
              {Math.min(itemPerPage * activePage, numberOfEntries)} of {numberOfEntries} entries
            </p>

            <div className={styles['pages-navigation']}>
              <FontAwesomeIcon
                icon={faBackwardFast}
                className={styles.fa}
                onClick={() => setActivePage(1)}
                title='First'
              />
              <FontAwesomeIcon
                icon={faBackwardStep}
                className={styles.fa}
                onClick={handlePreviousPage}
                title='Previous'
              />
              {PagesButtons.map((num) => (
                <button
                  key={num}
                  name={String(num)}
                  className={clsx(styles['page-button'], {
                    [styles['page-button__active']]: activePage === num,
                  })}
                  onClick={handleChangePage}
                >
                  {num}
                </button>
              ))}
              <FontAwesomeIcon
                icon={faForwardStep}
                className={styles.fa}
                onClick={handleNextPage}
                title='Next'
              />
              <FontAwesomeIcon
                icon={faForwardFast}
                className={styles.fa}
                onClick={() =>
                  setActivePage(
                    PagesButtons.reduce((accumulator, currentValue) =>
                      Math.max(accumulator, currentValue)
                    )
                  )
                }
                title='Last'
              />
            </div>
          </div>
        </section>
      </>
    )
  }
}
