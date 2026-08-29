"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const DemoStateContext = createContext(null);

const STORAGE_KEY = "metricgreen:state:v1";

const initialState = {
  hydrated: false,
  wallet: {
    /** @type {null | "metamask" | "walletconnect" | "coinbase" | "demo"} */
    provider: null,
    address: null,
    ensName: null,
    chainId: 11155111,
    balance: null,
    isAdmin: false,
  },
  producer: {
    /** @type {null | string} producerId from the producers dataset */
    id: null,
    /** @type {boolean} */
    isRegistered: false,
    /** @type {string} */
    certId: null,
    /** @type {string} */
    certRegisteredAt: null,
  },
  /** @type {string[]} */
  heldCreditIds: [],
  /** @type {string[]} */
  retiredCreditIds: [],
  ui: {
    commandOpen: false,
    sidebarOpen: false,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, hydrated: true };

    case "CONNECT_WALLET":
      return {
        ...state,
        wallet: { ...state.wallet, ...action.payload },
      };

    case "DISCONNECT_WALLET":
      return {
        ...state,
        wallet: initialState.wallet,
        producer: initialState.producer,
        heldCreditIds: [],
        retiredCreditIds: [],
      };

    case "REGISTER_CERT":
      return {
        ...state,
        producer: {
          ...state.producer,
          id: state.producer.id || "prd_01",
          isRegistered: true,
          certId: action.payload.certId,
          certRegisteredAt: action.payload.timestamp,
        },
      };

    case "REVOKE_CERT":
      return {
        ...state,
        producer: { ...state.producer, isRegistered: false, certId: null },
      };

    case "ADD_HELD_CREDIT":
      return state.heldCreditIds.includes(action.payload)
        ? state
        : { ...state, heldCreditIds: [action.payload, ...state.heldCreditIds] };

    case "RETIRE_CREDIT":
      return state.retiredCreditIds.includes(action.payload)
        ? state
        : {
            ...state,
            retiredCreditIds: [action.payload, ...state.retiredCreditIds],
            heldCreditIds: state.heldCreditIds.filter((id) => id !== action.payload),
          };

    case "UNRETIRE_CREDIT":
      return {
        ...state,
        retiredCreditIds: state.retiredCreditIds.filter((id) => id !== action.payload),
        heldCreditIds: [action.payload, ...state.heldCreditIds],
      };

    case "SET_SIDEBAR":
      return { ...state, ui: { ...state.ui, sidebarOpen: action.payload } };

    case "SET_COMMAND":
      return { ...state, ui: { ...state.ui, commandOpen: action.payload } };

    default:
      return state;
  }
}

export function DemoStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        dispatch({ type: "HYDRATE", payload: saved });
      } else {
        dispatch({ type: "HYDRATE", payload: {} });
      }
    } catch {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated || typeof window === "undefined") return;
    const persisted = {
      wallet: state.wallet,
      producer: state.producer,
      heldCreditIds: state.heldCreditIds,
      retiredCreditIds: state.retiredCreditIds,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore quota errors
    }
  }, [state.hydrated, state.wallet, state.producer, state.heldCreditIds, state.retiredCreditIds]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState() {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error("useDemoState must be used within DemoStateProvider");
  return ctx;
}

export function useWallet() {
  const { state, dispatch } = useDemoState();
  return {
    wallet: state.wallet,
    connect: (payload) => dispatch({ type: "CONNECT_WALLET", payload }),
    disconnect: () => dispatch({ type: "DISCONNECT_WALLET" }),
    switchChain: (chainId) =>
      dispatch({ type: "CONNECT_WALLET", payload: { chainId } }),
  };
}

export function useProducer() {
  const { state, dispatch } = useDemoState();
  return {
    producer: state.producer,
    register: (certId) =>
      dispatch({
        type: "REGISTER_CERT",
        payload: { certId, timestamp: new Date().toISOString() },
      }),
    revoke: () => dispatch({ type: "REVOKE_CERT" }),
  };
}

export function useHoldings() {
  const { state, dispatch } = useDemoState();
  return {
    held: state.heldCreditIds,
    retired: state.retiredCreditIds,
    hold: (id) => dispatch({ type: "ADD_HELD_CREDIT", payload: id }),
    retire: (id) => dispatch({ type: "RETIRE_CREDIT", payload: id }),
    unretyre: (id) => dispatch({ type: "UNRETIRE_CREDIT", payload: id }),
  };
}
