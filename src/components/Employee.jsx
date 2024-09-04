import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

function Employee({ employee, toggleEmployee }) {
  return (
    <React.Fragment>
      <div
        key={employee.id}
        className={`flex items-center gap-2 p-2 pl-4 border border-b-1 border-t-0 border-gray-200 h-14 ${
          employee.expanded ? "cursor-pointer" : ""
        }`}
        onClick={() => {
          if (employee.expanded) {
            toggleEmployee(employee.id, false);
          } else {
            toggleEmployee(employee.id, true);
          }
        }}
      >
        {employee.expanded ? <IoIosArrowDown /> : <IoIosArrowForward />}
        <div className="flex flex-col">
          <span>{employee.name}</span>
          <span className="text-gray-500 text-xs">{employee.title}</span>
        </div>
      </div>
      {employee.expanded &&
        employee.clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center gap-2 p-2 pl-4 h-10 border border-b-1 border-t-0 border-gray-200 text-sm"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: client.color }}
            />
            {client.name}
          </div>
        ))}
    </React.Fragment>
  );
}

export default Employee;
