import { useCallback, useRef, useState } from "react";
import { employees as empData } from "./assets/employees";
import { events as eventsData } from "./assets/events";
import Employee from "./components/Employee";
import { findMinStartAndMaxEnd, generateDateArray } from "./utils";
import moment from "moment";

const { minStart, maxEnd } = findMinStartAndMaxEnd(eventsData);
const dateObjectByMonth = generateDateArray(minStart, maxEnd);

function App() {
  const [events, setEvents] = useState(eventsData);
  const [employees, setEmployees] = useState(empData);
  const [resizing, setResizing] = useState(null);
  const resizingRef = useRef(null);

  const handleResizeStart = useCallback(
    (e, event, side) => {
      e.preventDefault();
      e.stopPropagation();
      const resizeInfo = {
        event,
        side,
        startX: e.clientX,
        originalLeft: event.left,
        originalWidth: event.width,
      };
      setResizing(resizeInfo);
      setResizing(resizeInfo);
      resizingRef.current = resizeInfo;
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
    },
    [setResizing]
  );

  const handleResizeMove = useCallback((e) => {
    if (!resizingRef.current) return;

    const { event, side, startX, originalLeft, originalWidth } =
      resizingRef.current;
    const diff = e.clientX - startX;
    const newEvent = { ...events.find((event) => event.id === event.id) };
    console.log({ diff, newEvent });
    if (side === "right") {
      if (diff > 0) {
        console.log("Increse end date");
      } else {
        console.log("Decrease end date");
      }
    }
    if (side === "left") {
      newEvent.left = originalLeft + diff;
      newEvent.width = originalWidth - diff;
    } else {
      console.log("Increase width", diff, originalWidth);
      newEvent.width = originalWidth + diff;
    }

    updateEvent(newEvent);
  }, []);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  }, []);

  const updateEvent = useCallback((updatedEvent) => {
    console.log({ updatedEvent });
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  }, []);

  const toggleEmployee = (employeeId, isExpanded) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, expanded: isExpanded }
          : employee
      )
    );
  };

  const getEmployeeEvents = (employeeId) => {
    const cardArray = [];
    const employeeEvents = events.filter(
      (event) => event.resourceId === employeeId
    );
    employeeEvents.map((event) => {
      const start = moment.utc(event.startDate).startOf("day");
      const end = moment.utc(event.endDate).startOf("day");

      const differenceInDays = end.diff(start, "days") + 1;

      const minStartNew = moment(minStart);
      const left = start.diff(minStartNew, "days");

      cardArray.push({
        id: event.id,
        left: left * 112,
        width: differenceInDays * 112,
        color: event.color,
        name: event.name,
        startDate: start.format("DD MMM"),
        endDate: end.format("DD MMM"),
      });
    });

    return cardArray;
  };

  const getClientEvents = (clientId) => {
    const cardArray = [];
    const clientEvents = events.filter(
      (event) => event.resourceId === clientId
    );
    console.log({ clientEvents });
    clientEvents.map((event) => {
      const start = moment.utc(event.startDate).startOf("day");
      const end = moment.utc(event.endDate).startOf("day");

      const differenceInDays = end.diff(start, "days") + 1;

      const minStartNew = moment(minStart);
      const left = start.diff(minStartNew, "days");

      cardArray.push({
        id: event.id,
        left: left * 112,
        width: event.width ? event.width : differenceInDays * 112,
        color: event.color,
        name: event.name,
        startDate: start.format("DD MMM"),
        endDate: end.format("DD MMM"),
      });
    });
    return cardArray;
  };

  return (
    <div className="flex">
      <div className="w-[15%] border-r border-gray-200">
        <h3 className="p-2 border bg-gray-100 border-b border-gray-200 h-14 flex items-center">
          Employees
        </h3>
        {employees.map((employee) => (
          <Employee
            key={employee.id}
            employee={employee}
            toggleEmployee={toggleEmployee}
          />
        ))}
      </div>
      <div className="w-[85%] flex flex-col flex-1 overflow-x-auto">
        <div className="border bg-gray-100 border-b-1 border-gray-200 h-14 flex items-center">
          {Object.keys(dateObjectByMonth).map((month) => (
            <div key={month} className="flex flex-col">
              <div className="h-7 text-center">{month}</div>
              <div className="flex">
                {dateObjectByMonth[month].map((date) => (
                  <div
                    key={date}
                    className="h-7 w-28 flex items-center justify-center text-sm border border-l-0 border-r-1 border-gray-200"
                  >
                    {moment(date).format("DD MMM")}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full">
          {employees.map((employee) => (
            <div className="w-full" key={employee.id}>
              <div className="flex items-center gap-2 py-2 px-0 border border-b-1 border-t-0 border-gray-200 h-14 ">
                {Object.keys(dateObjectByMonth).map((month) => (
                  <div key={month} className="flex flex-col">
                    <div className="flex relative">
                      {dateObjectByMonth[month].map((date) => (
                        <div
                          key={date}
                          height={56}
                          width={112}
                          className="h-14 w-28 flex items-center justify-center text-sm"
                        ></div>
                      ))}
                      {getEmployeeEvents(employee.id).map((event) => (
                        <div
                          key={event.id}
                          height={56}
                          style={{
                            left: event.left + "px",
                            width: event.width + "px",
                            backgroundColor: event.color,
                          }}
                          className="h-5 rounded-lg top-4 flex items-center justify-center text-xs absolute text-white"
                        >
                          {event.name} {event.startDate}-{event.endDate}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {employee.expanded &&
                employee.clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-2 py-2 px-0 h-10 border border-b-1 border-t-0  border-gray-200 text-sm"
                  >
                    {Object.keys(dateObjectByMonth).map((month) => (
                      <div key={month} className="flex flex-col">
                        <div className="flex relative">
                          {dateObjectByMonth[month].map((date) => (
                            <div
                              key={date}
                              className="h-10 w-28 flex items-center justify-center text-sm border border-b-0 border-l-0 border-r-1 border-gray-200"
                            ></div>
                          ))}
                          {getClientEvents(client.id).map((event) => (
                            <div
                              key={event.id}
                              height={56}
                              style={{
                                left: event.left + "px",
                                width: event.width + "px",
                                backgroundColor: client.color,
                              }}
                              className="h-4 rounded-lg top-3 flex items-center justify-center absolute text-white text-xs"
                            >
                              <div
                                className="absolute left-0 top-0 w-4 h-full cursor-col-resize opacity-0 group-hover:opacity-100 bg-black"
                                onMouseDown={(e) =>
                                  handleResizeStart(e, event, "left")
                                }
                              />
                              <div
                                className="absolute right-0 top-0 w-4 h-full cursor-col-resize opacity-0 group-hover:opacity-100 bg-black"
                                onMouseDown={(e) =>
                                  handleResizeStart(e, event, "right")
                                }
                              />
                              {event.name} {event.startDate}-{event.endDate}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
