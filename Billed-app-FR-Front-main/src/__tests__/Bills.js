/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import { ROUTES, ROUTES_PATH } from "../constants/routes";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.className).toEqual('active-icon')

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("Then on click on new bill I should be redirected", () => {
            Object.defineProperty(window, "localStorage", {
              value: localStorageMock,
            });
            window.localStorage.setItem(
              "user",
              JSON.stringify({
                type: "Employee",
              })
            );
            document.body.innerHTML = BillsUI({data: bills});
            const onNavigate = (pathname) => {
              document.body.innerHTML = ROUTES({ pathname });
            };
            const store = null;
            const billsComponent = new Bills({
              document,
              onNavigate,
              store,
              bills,
              localStorage: window.localStorage,
            });

            const handleClickNewBill = jest.fn(billsComponent.handleClickNewBill);
            const button = screen.getByTestId("btn-new-bill");
            button.addEventListener("click", handleClickNewBill);
            userEvent.click(button);
            expect(handleClickNewBill).toHaveBeenCalled();
    })

        test("Then on click on eye Icon a modal shall open", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
const billsComponent = new Bills({
  document,
  onNavigate,
  store,
  bills,
  localStorage: window.localStorage,
});

      const eye = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn(
        billsComponent.handleClickIconEye(eye[0])
      );
      
      addEventListener("click", handleClickIconEye);
      userEvent.click(eye[0]);
      expect(handleClickIconEye).toHaveBeenCalled();

      //const modale = screen.getByTestId("modaleFile");
      //expect(modale).toBeTruthy();
        });
  })
})
