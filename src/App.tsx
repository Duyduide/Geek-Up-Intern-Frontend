import {
  Refine,
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  useNotificationProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerBindings, {
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import {
  AlbumList,
  AlbumShow,
} from "./pages/albums";
import {
  UsersList,
  UserShow,
} from "./pages/users";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
                <Refine
                dataProvider={dataProvider("https://jsonplaceholder.typicode.com")}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                  name: "albums",
                  list: "/albums",
                  show: "/albums/show/:id",
                  meta: {
                    canDelete: true,
                  },
                  },
                  {
                  name: "users",
                  list: "/users",
                  show: "/users/show/:id",
                  meta: {
                    canDelete: true,
                  },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "A9w8tP-y50JDt-YMgqhv",
                  title: { text: "", icon: <img src="https://geekup.vn/Icons/geekup-logo-general.svg" width="100" alt="GeekUp Logo"  /> },
                }}
                >
                <Routes>
                  <Route
                  element={
                    <ThemedLayoutV2
                    Header={() => <Header sticky />}
                    Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                    >
                    <Outlet />
                    </ThemedLayoutV2>
                  }
                  >
                  <Route
                    index
                    element={<NavigateToResource resource="albums" />}
                  />
                  <Route path="/albums">
                    <Route index element={<AlbumList />} />
                    <Route path="show/:id" element={<AlbumShow />} />
                  </Route>
                  <Route path="/users">
                    <Route index element={<UsersList />} />
                    <Route path="show/:id" element={<UserShow />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
                </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
