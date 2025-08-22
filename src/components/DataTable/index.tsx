import { useEffect, useState, type MouseEvent } from "react";

interface ThemeType {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
}
interface DataTableType {
  datas: Array<Array<string>>;
  tableHeaders: Array<string>;
  tableTitle?: string;
  theme?: ThemeType;
}

const defaultTheme = {
  primaryColor: "#000000",
  backgroundColor: "#bfcedd",
  accentColor: "#3c56e7",
};

const OPTIONS_VALUES = [10, 25, 50, 100];

/**
 * Généric table.
 * Entries length must all be the same,
 * and tableHeaders length must ne equal to entries length.
 * User can:
 *    filter entries,
 *    sort entries by each table column
 *    choose number of entries per pages
 * @param {DataTableType} props - component props
 * @param {Array<Array<string>>} props.datas - array of table entries. Each entrie is an array
 * @param {Array<string>} props.tableHeaders - array of table head titles
 * @param {string} props.tableTitle - optional - table title
 * @param {ThemeType} props.theme - optional - css theme with colors
 * @param {string} props.theme.primaryColor - text and borders color
 * @param {string} props.theme.backgroundColor - background for alternates rows and page buttons
 * @param {string} props.theme.accentColor - active buttons and underline
 * @retrun {ReactElement}
 */
export function DataTable({
  datas,
  tableHeaders,
  tableTitle,
  theme,
}: DataTableType) {
  const [sortedDatas, setSortedDatas] = useState<Array<Array<string>>>([]);
  const [displayedDatas, setDisplayedDatas] = useState<Array<Array<string>>>(
    [],
  );
  const [itemPerPage, setItemPerPage] = useState<number>(10);
  const [isSorted, setIsSorted] = useState<boolean[]>([]);
  const [PagesButtons, setPagesButtons] = useState<Array<number>>([]);
  const [activePage, setActivePage] = useState<number>(1);
  const [numberOfEntries, setnumberOfEntries] = useState<number>(0);

  const finalTheme = { ...defaultTheme, ...theme };
  const styleVariables: React.CSSProperties = {
    "--table-primary": finalTheme.primaryColor,
    "--table-background": finalTheme.backgroundColor,
    "--table-accent": finalTheme.accentColor,
  };

  /**
   * This useEffect check datas changes.
   * Then sortedDatas, numberOfEntries and isSorted are initialized.
   */
  useEffect(() => {
    setSortedDatas(datas);
    setnumberOfEntries(datas.length);
    setIsSorted(new Array(tableHeaders.length).fill(false));
  }, [datas, tableHeaders.length]);

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
    setDisplayedDatas(
      sortedDatas.slice(
        (activePage - 1) * itemPerPage,
        itemPerPage * activePage,
      ),
    );
    const nbPages = Math.ceil(numberOfEntries / itemPerPage);
    setPagesButtons(Array.from({ length: nbPages }, (_, index) => index + 1));
  }, [sortedDatas, itemPerPage, activePage]);

  /**
   * This use effect checks if numberOfEntries
 changes.
   * It can happen when use filter employees.
   */
  useEffect(() => {
    const nbPages = Math.ceil(numberOfEntries / itemPerPage);
    setPagesButtons(Array.from({ length: nbPages }, (_, index) => index + 1));
  }, [numberOfEntries]);

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
    if (tableHeaders[index].toLowerCase().includes("date")) {
      const sorted = [...sortedDatas].sort((a, b) => {
        return isSorted[index]
          ? new Date(a[index]).getTime() - new Date(b[index]).getTime()
          : new Date(b[index]).getTime() - new Date(a[index]).getTime();
      });
      setSortedDatas(sorted);
      setDisplayedDatas(
        sorted.slice((activePage - 1) * itemPerPage, itemPerPage * activePage),
      );
    } else {
      const sorted = [...sortedDatas].sort(function (a, b) {
        return isSorted[index]
          ? a[index].localeCompare(b[index])
          : b[index].localeCompare(a[index]);
      });
      setSortedDatas(sorted);
      setDisplayedDatas(
        sorted.slice((activePage - 1) * itemPerPage, itemPerPage * activePage),
      );
    }
    const newIsSorted = [...isSorted];
    newIsSorted[index] = !newIsSorted[index];
    setIsSorted(newIsSorted);
  }

  /**
   * Employee filtering.
   * When user add characters in filter input new data list is created
   * and then number of entries
 and displayed list are updated.
   * Sorting datas are preserved.
   */
  function handleFilter() {
    const input = document.querySelector("input");
    if (input && input?.value.length > 0) {
      const newEmployeeList = sortedDatas.filter((data) =>
        data
          .map((item) => item.toLowerCase().includes(input.value.toLowerCase()))
          .reduce((acc, bool) => acc || bool),
      );
      setnumberOfEntries(newEmployeeList.length);
      setDisplayedDatas(
        newEmployeeList.slice(
          (activePage - 1) * itemPerPage,
          itemPerPage * activePage,
        ),
      );
    } else {
      setnumberOfEntries(sortedDatas.length);
      setDisplayedDatas(
        sortedDatas.slice(
          (activePage - 1) * itemPerPage,
          itemPerPage * activePage,
        ),
      );
    }
  }

  /**
   * Show select button options to choose number of entries
 per page
   */
  function toggleOptions() {
    const options = document.querySelector(".options");
    options?.classList.toggle("show-options");
  }

  /**
   * Number of row per page selection
   * @param {MouseEvent<HTMLDivElement>} event
   */
  function handleSelect(event: MouseEvent<HTMLDivElement>) {
    const optionValue = event.currentTarget.innerText;
    const selectValue = document.getElementById("select-value");
    if (selectValue) {
      selectValue.innerText = optionValue;
      setItemPerPage(Number(optionValue));
    }
    toggleOptions();
  }

  /**
   * Changing page with buttons page
   * @param event
   */
  function handleChangePage(event: MouseEvent<HTMLButtonElement>) {
    const currentPageButton = event.currentTarget;
    setActivePage(Number(currentPageButton.innerText));
  }

  /**
   * Changing page with previous button |<
   */
  function handlePreviousPage() {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    } else {
      setActivePage(1);
    }
    console.log(activePage);
  }

  /**
   * Changing page with next button >|
   */
  function handleNextPage() {
    const maxPage = PagesButtons.reduce((accumulator, currentValue) =>
      Math.max(accumulator, currentValue),
    );
    if (activePage < maxPage) {
      setActivePage(activePage + 1);
    } else {
      setActivePage(maxPage);
    }
    console.log(activePage);
  }

  if (!datas || !tableHeaders) {
    return <div>Données maquantes</div>;
  } else if (
    !datas
      .map((entries) => entries.length)
      .every((x) => x === tableHeaders.length)
  ) {
    return <div>Données invalides</div>;
  } else {
    return (
      <>
        <section className="data-table" style={styleVariables}>
          {tableTitle ? <h2 className="title">{tableTitle}</h2> : ""}
          <div className="tools">
            <div className="pagination">
              <div>Show</div>

              <div className="select">
                <div className="value" onClick={() => toggleOptions()}>
                  <p id="select-value">10</p>
                  <i className="fa fa-chevron-down"></i>
                </div>
                <div className="options">
                  {OPTIONS_VALUES.map((value) => (
                    <div
                      key={value}
                      className="option"
                      onClick={(event) => handleSelect(event)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <div>entries</div>
            </div>
            <div className="filter">
              <label className="">Search: </label>
              <input
                type="text"
                placeholder="filter"
                name="filter"
                onChange={() => handleFilter()}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                {tableHeaders?.map((header, index) => (
                  <th key={index}>
                    {header}{" "}
                    <i
                      className="fa fa-sort"
                      onClick={() => handleSort(index)}
                    ></i>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedDatas.map((row, index) => (
                <tr key={index} className="row">
                  {row.map((item, index) => (
                    <td key={index}>{item}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="tools">
            <p>
              Showing {(activePage - 1) * itemPerPage + 1} to{" "}
              {Math.min(itemPerPage * activePage, numberOfEntries)} of{" "}
              {numberOfEntries} entries
            </p>
            <div className="pages-navigation">
              <i
                className="fa fa-backward-fast"
                onClick={() => setActivePage(1)}
                title="First"
              ></i>
              <i
                className="fa fa-backward-step"
                onClick={() => handlePreviousPage()}
                title="Previous"
              ></i>
              {PagesButtons.map((num) => (
                <button
                  key={num}
                  name={String(num)}
                  className={
                    activePage === num
                      ? "page-button page-button_active"
                      : "page-button"
                  }
                  onClick={(event) => handleChangePage(event)}
                >
                  {num}
                </button>
              ))}
              <i
                className="fa fa-forward-step"
                onClick={() => handleNextPage()}
                title="Next"
              ></i>
              <i
                className="fa fa-forward-fast"
                onClick={() =>
                  setActivePage(
                    PagesButtons.reduce((accumulator, currentValue) =>
                      Math.max(accumulator, currentValue),
                    ),
                  )
                }
                title="Last"
              ></i>
            </div>
          </div>
        </section>
      </>
    );
  }
}
