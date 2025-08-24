import { Navigate, Route, Routes } from "react-router-dom";
import { RoutePath } from "./route-path";
import Layout from "../layout";
import CreateCustomers from "../pages/create-customers";
import Customers from "../pages/customers";
import Invoices from "../pages/invoices";

const routes = (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Customers />} />
      <Route path={RoutePath.INVOICES} element={<Invoices />} />
      <Route path={RoutePath.CREATE_CUSTOMER} element={<CreateCustomers />} />
    </Route>
    <Route path="*" element={<Navigate replace to={"/"} />} />
  </Routes>
);

export default routes;
