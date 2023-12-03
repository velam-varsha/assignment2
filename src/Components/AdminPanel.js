import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setpopup] = useState(false);
  const [usersPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatedname, setupdatedname] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [userid, setuserid] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        setUsers([]);
      });
  }, []);

  const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  const editUser = (userId) => {
    // Find the user with the given ID
    const userToEdit = users.find((user) => user.id === userId);

    // Set the updatedname state with the user's data for editing
    setupdatedname({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
    });
    setuserid(userId);

    // Display the popup for editing
    setpopup(true);
  };

  const updateUser = () => {
    // Find the index of the user in the users array
    const userIndex = users.findIndex((user) => user.id === userid);
    console.log(userIndex);

    if (userIndex !== -1) {
      // Create a copy of the users array
      const updatedUsers = [...users];

      // Modify the user's data based on the updatedname state
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        ...updatedname,
      };

      // Update the state with the modified users array
      console.log(updatedUsers);
      setUsers(updatedUsers);
    }

    // Close the popup after updating
    setpopup(false);
  };
  const getUpdatedData = (e) => {
    setupdatedname({ ...updatedname, [e.target.name]: e.target.value });
    console.log(updatedname);
  };

  const handleCheckboxChange = (event, userId) => {
    const isChecked = event.target.checked;
    if (isChecked && !selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allUserIds = users.map((user) => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <>
      {popup ? (
        <div
          class="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        class="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        class="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Edit Account Details
                      </h3>
                      <div class="mt-2">
                        <div class="mb-4">
                          <label
                            for="name"
                            class="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={getUpdatedData}
                            autocomplete="name"
                            placeholder="Enter your name"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div class="mb-4">
                          <label
                            for="email"
                            class="block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={getUpdatedData}
                            autocomplete="email"
                            placeholder="Enter your email address"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div class="mb-4">
                          <label
                            for="role"
                            class="block text-sm font-medium text-gray-700"
                          >
                            Role
                          </label>
                          <input
                            type="text"
                            name="role"
                            id="role"
                            onChange={getUpdatedData}
                            autocomplete="role"
                            placeholder="Enter your role"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => updateUser()}
                    class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setpopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="m-3">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-2 py-1 rounded"
            />
            <button
              onClick={() => setSearchTerm("")}
              className="ml-2 px-4 py-1 bg-gray-200 rounded"
            >
              Clear
            </button>
          </div>
          <button
            onClick={() => setSelectedUsers([])}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Delete Selected
          </button>
        </div>
        <table className="w-full text-center border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 w-12">
                <input type="checkbox" onChange={(e) => handleSelectAll(e)} />
              </th>
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Role</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className={selectedUsers.includes(user.id) ? "bg-gray-100" : ""}
              >
                <td className="py-3">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, user.id)}
                    checked={selectedUsers.includes(user.id)}
                  />
                </td>
                <td className="py-3">{user.name}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">{user.role}</td>
                <td className="py-3">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-white text-white px-3 py-1 rounded-full focus:outline-none"
                  >
                    <img src={require("../Assets/delete.png")} alt="Delete" />
                  </button>
                  <button
                    onClick={() => editUser(user.id)}
                    className="bg-white text-white px-3 py-1 rounded-full focus:outline-none"
                  >
                    <img src={require("../Assets/edit.png")} alt="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(1)}
            className="mx-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
          >
            &lt;&lt; First Page
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            className="mx-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
          >
            Previous
          </button>
          <button className="mx-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none">
            {currentPage}
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
            className="mx-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
          >
            Next
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => paginate(totalPages)}
            className="mx-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
          >
            Last Page &gt;&gt;
          </button>
        </div>
        <div className="mt-4 font-bold text-gray-400 text-sm">
          {`${selectedUsers.length} of ${users.length} row(s) selected.`}
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
