import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./styles.css";

const Home = () => {
  const [uId, setUId] = useState();
  const [invoiceName, setInvoiceName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [rate, setRate] = useState(0);
  const [error, setError] = useState("");
  const [itemArray, setItemArray] = useState([
    { items: "A", value: "10", isDisable: false },
    { items: "B", value: "20", isDisable: false },
    { items: "C", value: "15", isDisable: false },
    { items: "D", value: "30", isDisable: false },
    { items: "E", value: "5", isDisable: false },
  ]);
  const totalPrice = tableData.reduce((a, b) => a + b.total, 0);
  const discountNumber = (totalPrice / 100) * rate || 0;
  const ref = useRef(null);

  const handleItemChange = (value, rowIndex) => {
    const tableDataClone = [...tableData];
    tableDataClone[rowIndex].item = value;
    tableDataClone[rowIndex].qty = 1;
    const amount = itemArray.find((x) => x.items === value).value;
    tableDataClone[rowIndex].amount = parseInt(amount);
    tableDataClone[rowIndex].total =
      tableDataClone[rowIndex].qty * parseInt(amount);
    setTableData(tableDataClone);
    const newArr = itemArray.map((obj) => {
      if (obj.items === value) {
        return { ...obj, isDisable: true };
      }
      return obj;
    });

    setItemArray(newArr);
  };

  const handleQtyChange = (value, rowIndex) => {
    const tableDataClone = [...tableData];
    tableDataClone[rowIndex].qty = value;
    tableDataClone[rowIndex].total =
      tableDataClone[rowIndex].qty * tableDataClone[rowIndex].amount;
    setTableData(tableDataClone);
  };
  const handleQtyInputBlur = (rowIndex) => {
    const tableDataClone = [...tableData];
    tableDataClone[rowIndex].show_input = false;
    setTableData(tableDataClone);
  };

  const handleQtyInput = (rowIndex) => {
    const tableDataClone = [...tableData];
    tableDataClone[rowIndex].show_input = true;
    setTableData(tableDataClone);
  };

  const addRow = (rowIndex) => {
    if (invoiceName.length === 0) {
      setError("Name is required");
      return;
    } else {
      setError("");
    }
    const newRow = {
      id: rowIndex + 1,
      item: "",
      qty: 0,
      amount: 0,
      total: 0,
      show_input: false,
    };

    const tableDataClone = [...tableData];
    tableDataClone.map((row, index) => {
      if (row.id > rowIndex) {
        tableDataClone[index].id = tableDataClone[index].id + 1;
      }
    });
    tableDataClone.push(newRow);
    tableDataClone.sort((a, b) => a.id - b.id);
    setTableData(tableDataClone);
  };

  useEffect(() => {
    setUId(uuidv4());
    setTableData([
      { id: 0, item: "", qty: 0, amount: 0, total: 0, show_input: false },
    ]);
  }, []);

  return (
    <>
      <div className="header">
        <div className="headerRow">
          <p className="title">Invoice No :</p>
          <div className="inputWrapper">
            <input type={"text"} value={uId} disabled />
          </div>
        </div>
        <div className="headerRow">
          <p className="title">Name :</p>
          <div className="inputWrapper">
            <input
              type={"text"}
              value={invoiceName}
              onChange={(e) => {
                setInvoiceName(e.target.value);
                setError("");
              }}
            />
            {error ? <span>{error}</span> : ""}
          </div>
        </div>
      </div>
      <div className="dataTable">
        <table id="data-table">
          <tr>
            <th>Items</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
          {tableData?.map((row, index) => {
            return (
              <tr key={row.id}>
                <td>
                  <select
                    name={"item"}
                    onChange={(e) => handleItemChange(e.target.value, row.id)}
                    defaultValue=""
                    value={row.item}
                  >
                    <option value="">select</option>
                    {itemArray.map((i, key) => (
                      <option value={i.items} key={key} disabled={i.isDisable}>
                        {i.items}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div ref={ref}>
                    {row.show_input ? (
                      <input
                        type={"number"}
                        onChange={(e) =>
                          handleQtyChange(e.target.value, row.id)
                        }
                        onBlur={(e) => handleQtyInputBlur(row.id)}
                        value={row.qty}
                      />
                    ) : (
                      <span
                        className="itemQty"
                        onClick={() => handleQtyInput(row.id)}
                      >
                        {row.qty}
                      </span>
                    )}
                  </div>
                </td>
                <td>{row.amount}</td>
                <td>{row.total}</td>
                <td>
                  <div>
                    <button
                      onClick={(e) => addRow(row.id)}
                      disabled={!row.total}
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
      <div className="footer">
        <div className="footerRow">
          <p className="title">Final Total : </p>
          {totalPrice}
        </div>
        <div className="footerRow">
          <p className="title">Discount : </p>
          <input
            type={"number"}
            onChange={(e) => setRate(e.target.value)}
            value={rate}
            placeholder="%"
          />
          {-discountNumber}
        </div>
        <div className="footerRow">
          <p className="title">Final Amount : </p>
          {totalPrice - discountNumber}
        </div>
      </div>
    </>
  );
};

export default Home;
