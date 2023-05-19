import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import React, { useContext, useState } from 'react'
import { FCWithChildren } from '../../../../../../utils/react'

interface IAlertContext {
  alertState: AlertState
  setAlertState: (alertState: AlertState) => void
}

export interface AlertState {
  open: boolean
  message: string
  severity: 'success' | 'info' | 'warning' | 'error' | undefined
}

export const AlertContext = React.createContext<IAlertContext>({
  alertState: {
    open: false,
    message: '',
    severity: undefined,
  },
  setAlertState: () => {},
})

export const SnackbarProvider: FCWithChildren<{}> = ({ children }) => {
  // const alertState = useContext(AlertContext)
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  })
  return (
    <AlertContext.Provider
      value={{
        alertState,
        setAlertState,
      }}
    >
      {children}
      <MySnackbar />
    </AlertContext.Provider>
  )
}

const MySnackbar = () => {
  const { alertState, setAlertState } = useContext(AlertContext)
  return (
    <Snackbar
      open={alertState.open}
      autoHideDuration={6000}
      onClose={() => setAlertState({ ...alertState, open: false })}
    >
      <Alert
        onClose={() => setAlertState({ ...alertState, open: false })}
        severity={alertState.severity}
      >
        {alertState.message}
      </Alert>
    </Snackbar>
  )
}
