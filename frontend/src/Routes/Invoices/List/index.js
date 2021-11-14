import * as React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

const formHeading =
  " text-base tracking-wider font-bold font-sans px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider";
const inputCss = "focus:outline-none focus:ring-4 focus:ring-green-600";

const List = ({}) => {
  const [list, setList] = React.useState([]);
  const [flagToRefetch, setFlagToRefetch] = React.useState(false);

  React.useEffect(() => {
    toast.loading("Fetching Invoices", { id: "Inv" });
    let userId = JSON.parse(localStorage.getItem("user"))._id;
    axios
      .post(
        `${process.env.REACT_APP_SERVER_LINK}/file/fetchInvCompany`,
        { userId },
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("jwt")),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toast.success("Invoices Fetched");
        toast.dismiss("Inv");
        setList(res.data);
      })
      .catch((error) => {
        toast.error(error.response.data);
        toast.dismiss("Inv");
        console.error(error);
      });
  }, [flagToRefetch]);

  const Delete = (id) => {
    toast.loading("Deleting", { id: "delete" });
    axios
      .post(
        `${process.env.REACT_APP_SERVER_LINK}/file/DeleteInvoice`,
        { id },
        {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("jwt")),
          },
        }
      )
      .then((res) => {
        toast.success("Deleted");
        toast.dismiss("delete");
        setFlagToRefetch(!flagToRefetch);
      })
      .catch((error) => {
        toast.error(error.response.data);
        toast.dismiss("delete");
        console.error(error);
        setFlagToRefetch(!flagToRefetch);
      });
  };

  return (
    <div
      className="flex flex-col sm:w-4/5 lg:w-1/2 w-full my-12 
    min-h-1/2 border shadow-lg "
    >
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className={formHeading}>
                    Sr. No.
                  </th>
                  <th scope="col" className={formHeading}>
                    Date
                  </th>
                  <th scope="col" className={formHeading}>
                    Financial Institute
                  </th>
                  <th scope="col" className={formHeading}>
                    Invoice No.
                  </th>
                  <th scope="col" className={formHeading}>
                    Status
                  </th>
                  <th scope="col" />
                  <th scope="col" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.map((item, index) => {
                  return (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {moment(item.createdAt).format("DD/MM/YYYY") || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {moment(item.createdAt).format("hh:mm a") || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.financial.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.financial.userName || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.invoice || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "pending"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </td>
                      <td className="pr-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Show PDF
                        </a>
                      </td>
                      <td className="pr-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          onClick={() => {
                            Delete(item._id);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
