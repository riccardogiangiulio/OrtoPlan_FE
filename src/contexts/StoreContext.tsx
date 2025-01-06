import IUser from "@/interfaces/User";
import { api } from "@/contexts/AuthContext";
import { createContext, ReactNode, useContext, useReducer } from "react";


interface IStoreContextState {
    users: IUser[];
}

interface IStoreContextProps extends IStoreContextState {
    dispatch: React.Dispatch<StoreAction>;
    handleUserEdit: (userId: number, userData: Partial<IUser>) => void;
    handleUserDelete: (userId: number) => void;
    handlePasswordUpdate: (userId: number, newPassword: string) => void;
}

type StoreAction =
    | {
          type: "UPDATE_USER";
          payload: {
              user: IUser;
          };
      }
    | {
          type: "DELETE_USER";
          payload: {
              userId: IUser["userId"];
          };
      };

const storeReducer = (state: IStoreContextState, action: StoreAction): IStoreContextState => {
    switch (action.type) {
        case "UPDATE_USER":
            return {
                ...state,
                users: state.users.map((user) => 
                    user.userId === action.payload.user.userId ? action.payload.user : user
                ),
            };

        case "DELETE_USER":
            return {
                ...state,
                users: state.users.filter((user) => user.userId !== action.payload.userId),
            };

        default:
            return state;
    }
};

export const StoreContext = createContext<IStoreContextProps | null>(null);

const initialState: IStoreContextState = {
    users: [],
};

const STORAGE_URL = import.meta.env.VITE_API_BACKEND_URL;

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(storeReducer, initialState);

    function handleUserEdit(userId: number, userData: Partial<IUser>) {
        const updates = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        };

        api
            .put(`/users/${userId}`, updates)
            .then(({ data: updatedUser }) => {
                dispatch({
                    type: "UPDATE_USER",
                    payload: {
                        user: updatedUser
                    },
                });
            })
            .catch((err) => {
                if (err.response?.data) {
                    console.error("Errore:", err.response.data);
                } else {
                    console.error("Errore durante l'aggiornamento dell'utente:", err);
                }
            });
    }

    function handlePasswordUpdate(userId: number, newPassword: string) {
        api
            .put(`/users/password/${userId}`, `password=${newPassword}`)
            .then(() => {
                console.log("Password aggiornata con successo");
            })
            .catch((err) => {
                if (err.response?.data) {
                    console.error("Errore:", err.response.data);
                } else {
                    console.error("Errore durante l'aggiornamento della password:", err);
                }
            });
    }

    function handleUserDelete(userId: number) {
        api
            .delete(`/users/${userId}`)
            .then(() => {
                dispatch({
                    type: "DELETE_USER",
                    payload: {
                        userId,
                    },
                });
            })
            .catch((err) => {
                console.error("Errore durante l'eliminazione dell'utente:", err);
            });
    }

    return (
        <StoreContext.Provider
            value={{ 
                ...state, 
                dispatch, 
                handleUserEdit, 
                handleUserDelete,
                handlePasswordUpdate 
            }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStoreContext deve essere utilizzato all'interno di StoreProvider");
    }
    return context;
};
