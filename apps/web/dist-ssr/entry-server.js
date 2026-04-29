var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import * as React from "react";
import { useContext, createContext, forwardRef, createElement, useState, useCallback, useEffect, useRef, useMemo, useId, useInsertionEffect, Children, isValidElement, useLayoutEffect, Fragment as Fragment$1, Component, lazy, Suspense } from "react";
import { stripBasename, UNSAFE_warning, UNSAFE_invariant, matchPath, joinPaths, Action } from "@remix-run/router";
import { UNSAFE_NavigationContext, useHref, useNavigate, useLocation, useResolvedPath, createPath, UNSAFE_DataRouterStateContext, UNSAFE_useRouteId, UNSAFE_RouteContext, UNSAFE_DataRouterContext, parsePath, Router, useParams, Navigate, Routes, Route } from "react-router";
import "react-dom";
import "posthog-js";
/**
 * React Router DOM v6.30.3
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
const defaultMethod = "get";
const defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
  return object != null && typeof object.tagName === "string";
}
function isButtonElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
  return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo2, key) => {
    let value = init[key];
    return memo2.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
let _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
  if (_formDataSupportsSubmitter === null) {
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      );
      _formDataSupportsSubmitter = false;
    } catch (e) {
      _formDataSupportsSubmitter = true;
    }
  }
  return _formDataSupportsSubmitter;
}
const supportedFormEncTypes = /* @__PURE__ */ new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function getFormEncType(encType) {
  if (encType != null && !supportedFormEncTypes.has(encType)) {
    process.env.NODE_ENV !== "production" ? UNSAFE_warning(false, '"' + encType + '" is not a valid `encType` for `<Form>`/`<fetcher.Form>` ' + ('and will default to "' + defaultEncType + '"')) : void 0;
    return null;
  }
  return encType;
}
function getFormSubmissionInfo(target, basename) {
  let method;
  let action;
  let encType;
  let formData;
  let body;
  if (isFormElement(target)) {
    let attr = target.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(target);
  } else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
    let form = target.form;
    if (form == null) {
      throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
    }
    let attr = target.getAttribute("formaction") || form.getAttribute("action");
    action = attr ? stripBasename(attr, basename) : null;
    method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
    encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
    formData = new FormData(form, target);
    if (!isFormDataSubmitterSupported()) {
      let {
        name,
        type,
        value
      } = target;
      if (type === "image") {
        let prefix = name ? name + "." : "";
        formData.append(prefix + "x", "0");
        formData.append(prefix + "y", "0");
      } else if (name) {
        formData.append(name, value);
      }
    }
  } else if (isHtmlElement(target)) {
    throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
  } else {
    method = defaultMethod;
    action = null;
    encType = defaultEncType;
    body = target;
  }
  if (formData && encType === "text/plain") {
    body = formData;
    formData = void 0;
  }
  return {
    action,
    method: method.toLowerCase(),
    encType,
    formData,
    body
  };
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"], _excluded3 = ["fetcherKey", "navigate", "reloadDocument", "replace", "state", "method", "action", "onSubmit", "relative", "preventScrollReset", "viewTransition"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const ViewTransitionContext = /* @__PURE__ */ React.createContext({
  isTransitioning: false
});
if (process.env.NODE_ENV !== "production") {
  ViewTransitionContext.displayName = "ViewTransition";
}
const FetchersContext = /* @__PURE__ */ React.createContext(/* @__PURE__ */ new Map());
if (process.env.NODE_ENV !== "production") {
  FetchersContext.displayName = "Fetchers";
}
if (process.env.NODE_ENV !== "production") ;
const isBrowser$2 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ React.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX$1.test(to)) {
    absoluteHref = to;
    if (isBrowser$2) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
        process.env.NODE_ENV !== "production" ? UNSAFE_warning(false, '<Link to="' + to + '"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.') : void 0;
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ React.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
if (process.env.NODE_ENV !== "production") {
  Link.displayName = "Link";
}
const NavLink = /* @__PURE__ */ React.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = React.useContext(UNSAFE_DataRouterStateContext);
  let {
    navigator: navigator2,
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ React.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
if (process.env.NODE_ENV !== "production") {
  NavLink.displayName = "NavLink";
}
const Form = /* @__PURE__ */ React.forwardRef((_ref9, forwardedRef) => {
  let {
    fetcherKey,
    navigate,
    reloadDocument,
    replace,
    state,
    method = defaultMethod,
    action,
    onSubmit,
    relative,
    preventScrollReset,
    viewTransition
  } = _ref9, props = _objectWithoutPropertiesLoose(_ref9, _excluded3);
  let submit = useSubmit();
  let formAction = useFormAction(action, {
    relative
  });
  let formMethod = method.toLowerCase() === "get" ? "get" : "post";
  let submitHandler = (event) => {
    onSubmit && onSubmit(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    let submitter = event.nativeEvent.submitter;
    let submitMethod = (submitter == null ? void 0 : submitter.getAttribute("formmethod")) || method;
    submit(submitter || event.currentTarget, {
      fetcherKey,
      method: submitMethod,
      navigate,
      replace,
      state,
      relative,
      preventScrollReset,
      viewTransition
    });
  };
  return /* @__PURE__ */ React.createElement("form", _extends({
    ref: forwardedRef,
    method: formMethod,
    action: formAction,
    onSubmit: reloadDocument ? onSubmit : submitHandler
  }, props));
});
if (process.env.NODE_ENV !== "production") {
  Form.displayName = "Form";
}
if (process.env.NODE_ENV !== "production") ;
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = React.useContext(UNSAFE_DataRouterContext);
  !ctx ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, getDataRouterConsoleError(hookName)) : UNSAFE_invariant(false) : void 0;
  return ctx;
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return React.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
function useSearchParams(defaultInit) {
  process.env.NODE_ENV !== "production" ? UNSAFE_warning(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.") : void 0;
  let defaultSearchParamsRef = React.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = React.useRef(false);
  let location = useLocation();
  let searchParams = React.useMemo(() => (
    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setSearchParams({}) if it has an initial value
    getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current)
  ), [location.search]);
  let navigate = useNavigate();
  let setSearchParams = React.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}
function validateClientSideSubmission() {
  if (typeof document === "undefined") {
    throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.");
  }
}
let fetcherId = 0;
let getUniqueFetcherId = () => "__" + String(++fetcherId) + "__";
function useSubmit() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseSubmit);
  let {
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let currentRouteId = UNSAFE_useRouteId();
  return React.useCallback(function(target, options) {
    if (options === void 0) {
      options = {};
    }
    validateClientSideSubmission();
    let {
      action,
      method,
      encType,
      formData,
      body
    } = getFormSubmissionInfo(target, basename);
    if (options.navigate === false) {
      let key = options.fetcherKey || getUniqueFetcherId();
      router.fetch(key, currentRouteId, options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        flushSync: options.flushSync
      });
    } else {
      router.navigate(options.action || action, {
        preventScrollReset: options.preventScrollReset,
        formData,
        body,
        formMethod: options.method || method,
        formEncType: options.encType || encType,
        replace: options.replace,
        state: options.state,
        fromRouteId: currentRouteId,
        flushSync: options.flushSync,
        viewTransition: options.viewTransition
      });
    }
  }, [router, basename, currentRouteId]);
}
function useFormAction(action, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    basename
  } = React.useContext(UNSAFE_NavigationContext);
  let routeContext = React.useContext(UNSAFE_RouteContext);
  !routeContext ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "useFormAction must be used inside a RouteContext") : UNSAFE_invariant(false) : void 0;
  let [match] = routeContext.matches.slice(-1);
  let path = _extends({}, useResolvedPath(action ? action : ".", {
    relative
  }));
  let location = useLocation();
  if (action == null) {
    path.search = location.search;
    let params = new URLSearchParams(path.search);
    let indexValues = params.getAll("index");
    let hasNakedIndexParam = indexValues.some((v) => v === "");
    if (hasNakedIndexParam) {
      params.delete("index");
      indexValues.filter((v) => v).forEach((v) => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? "?" + qs : "";
    }
  }
  if ((!action || action === ".") && match.route.index) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = React.useContext(ViewTransitionContext);
  !(vtContext != null) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?") : UNSAFE_invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
function StaticRouter({
  basename,
  children,
  location: locationProp = "/",
  future
}) {
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let action = Action.Pop;
  let location = {
    pathname: locationProp.pathname || "/",
    search: locationProp.search || "",
    hash: locationProp.hash || "",
    state: locationProp.state != null ? locationProp.state : null,
    key: locationProp.key || "default"
  };
  let staticNavigator = getStatelessNavigator();
  return /* @__PURE__ */ React.createElement(Router, {
    basename,
    children,
    location,
    navigationType: action,
    navigator: staticNavigator,
    future,
    static: true
  });
}
function getStatelessNavigator() {
  return {
    createHref,
    encodeLocation,
    push(to) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
    },
    replace(to) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
    },
    go(delta) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
    },
    back() {
      throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
    },
    forward() {
      throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
    }
  };
}
function createHref(to) {
  return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
  let href = typeof to === "string" ? to : createPath(to);
  href = href.replace(/ $/, "%20");
  let encoded = ABSOLUTE_URL_REGEX.test(href) ? new URL(href) : new URL(href, "http://localhost");
  return {
    pathname: encoded.pathname,
    search: encoded.search,
    hash: encoded.hash
  };
}
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const LucideContext = createContext({});
const useLucideContext = () => useContext(LucideContext);
const Icon = forwardRef(
  ({ color: color2, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = useLucideContext() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size ?? contextSize ?? defaultAttributes.width,
        height: size ?? contextSize ?? defaultAttributes.height,
        stroke: color2 ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: mergeClasses("lucide", contextClass, className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component2 = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component2.displayName = toPascalCase(iconName);
  return Component2;
};
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$D = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$D);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$C = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$C);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$B = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$B);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$A = [
  ["path", { d: "M8 6v6", key: "18i7km" }],
  ["path", { d: "M15 6v6", key: "1sg6z9" }],
  ["path", { d: "M2 12h19.6", key: "de5uta" }],
  [
    "path",
    {
      d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
      key: "1wwztk"
    }
  ],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
  ["path", { d: "M9 18h5", key: "lrx6i" }],
  ["circle", { cx: "16", cy: "18", r: "2", key: "1v4tcr" }]
];
const Bus = createLucideIcon("bus", __iconNode$A);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$z = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$z);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$y = [
  [
    "path",
    {
      d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
      key: "5owen"
    }
  ],
  ["circle", { cx: "7", cy: "17", r: "2", key: "u2ysq9" }],
  ["path", { d: "M9 17h6", key: "r8uit2" }],
  ["circle", { cx: "17", cy: "17", r: "2", key: "axvx0g" }]
];
const Car = createLucideIcon("car", __iconNode$y);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$x = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$x);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$w = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$w);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$v = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$v);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$u = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$u);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$t = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$t);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$s = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$s);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$r = [
  ["path", { d: "M4 10h12", key: "1y6xl8" }],
  ["path", { d: "M4 14h9", key: "1loblj" }],
  [
    "path",
    {
      d: "M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2",
      key: "1j6lzo"
    }
  ]
];
const Euro = createLucideIcon("euro", __iconNode$r);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$q = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$q);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$p = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$p);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$o = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$o);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$n = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$n);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$m = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12", key: "bvdh0s" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12", key: "1tbv5k" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5", key: "11lu5j" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
  ["circle", { cx: "12", cy: "12", r: "7", key: "fim9np" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const LocateFixed = createLucideIcon("locate-fixed", __iconNode$m);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$l = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$l);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$k = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$k);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$j = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$j);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const MessageCircleQuestionMark = createLucideIcon("message-circle-question-mark", __iconNode$i);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$h);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
];
const Music2 = createLucideIcon("music-2", __iconNode$g);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["path", { d: "M9 18V5l12-2v13", key: "1jmyc2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["circle", { cx: "18", cy: "16", r: "3", key: "1hluhg" }]
];
const Music = createLucideIcon("music", __iconNode$f);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$e);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode$d);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$c);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$b);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode$a);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$9);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M10 5H3", key: "1qgfaw" }],
  ["path", { d: "M12 19H3", key: "yhmn1j" }],
  ["path", { d: "M14 3v4", key: "1sua03" }],
  ["path", { d: "M16 17v4", key: "1q0r14" }],
  ["path", { d: "M21 12h-9", key: "1o4lsq" }],
  ["path", { d: "M21 19h-5", key: "1rlt1p" }],
  ["path", { d: "M21 5h-7", key: "1oszz2" }],
  ["path", { d: "M8 10v4", key: "tgpxqk" }],
  ["path", { d: "M8 12H3", key: "a7s4jb" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode$8);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$7);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$6);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
      key: "qn84l0"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const TicketCheck = createLucideIcon("ticket-check", __iconNode$5);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "16", height: "16", x: "4", y: "3", rx: "2", key: "1wxw4b" }],
  ["path", { d: "M4 11h16", key: "mpoxn0" }],
  ["path", { d: "M12 3v8", key: "1h2ygw" }],
  ["path", { d: "m8 19-2 3", key: "13i0xs" }],
  ["path", { d: "m18 22-2-3", key: "1p0ohu" }],
  ["path", { d: "M8 15h.01", key: "a7atzg" }],
  ["path", { d: "M16 15h.01", key: "rnfrdf" }]
];
const TramFront = createLucideIcon("tram-front", __iconNode$4);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$3);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$2);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$1);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const BASE = "";
class ApiError extends Error {
  constructor(message, status, path, body) {
    super(message);
    this.status = status;
    this.path = path;
    this.body = body;
    this.name = "ApiError";
  }
}
async function request(path, init = {}) {
  const url = `${BASE}${path}`;
  const isFormData = init.body instanceof FormData;
  const headers = {
    accept: "application/json",
    ...init.body && !isFormData ? { "content-type": "application/json" } : {},
    ...init.headers
  };
  const res = await fetch(url, { ...init, headers, credentials: "include" });
  const ctype = res.headers.get("content-type") ?? "";
  const body = ctype.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = typeof body === "object" && body && "message" in body && String(body.message) || typeof body === "object" && body && "error" in body && String(body.error) || res.statusText;
    throw new ApiError(message, res.status, path, body);
  }
  return body;
}
function query(params) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === void 0 || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}
const api = {
  health: () => request("/api/health"),
  auth: {
    register: (email, password, name, profile, ref) => request(`/api/auth/register${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`, {
      method: "POST",
      body: JSON.stringify({ email, password, name, tos_accepted: true, ...profile })
    }),
    deleteAccount: () => request("/api/auth/me", { method: "DELETE" }),
    login: (email, password) => request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
    forgotPassword: (email) => request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email })
    }),
    checkVerifyToken: (token) => request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
    verifyEmail: (token) => request("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token })
    }),
    resendVerification: () => request("/api/auth/resend-verification", {
      method: "POST"
    }),
    resetPassword: (token, password) => request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password })
    }),
    me: () => request("/api/auth/me"),
    updateProfile: (input) => request("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
    myLicenseReview: () => request("/api/auth/verify-license/status"),
    verifyLicense: (file) => {
      const form = new FormData();
      form.append("document", file);
      return request("/api/auth/verify-license", {
        method: "POST",
        body: form
      });
    },
    myIdentityReview: () => request("/api/auth/verify-identity/status"),
    verifyIdentity: (file) => {
      const form = new FormData();
      form.append("document", file);
      return request("/api/auth/verify-identity", {
        method: "POST",
        body: form
      });
    },
    sendPhoneOtp: (phone) => request("/api/auth/send-phone-otp", {
      method: "POST",
      body: JSON.stringify({ phone })
    }),
    verifyPhoneOtp: (otp) => request("/api/auth/verify-phone-otp", {
      method: "POST",
      body: JSON.stringify({ otp })
    }),
    logout: () => request("/api/auth/logout", { method: "POST" })
  },
  concerts: {
    list: (q = {}) => request(`/api/concerts${query(q)}`),
    facets: () => request("/api/concerts/facets"),
    get: (id2) => request(`/api/concerts/${encodeURIComponent(id2)}`),
    create: (input) => request("/api/concerts", {
      method: "POST",
      body: JSON.stringify(input)
    }),
    getInterest: (concertId) => request(`/api/concerts/${encodeURIComponent(concertId)}/interest`),
    toggleInterest: (concertId) => request(`/api/concerts/${encodeURIComponent(concertId)}/interest`, {
      method: "POST"
    })
  },
  rides: {
    list: (q = {}) => request(`/api/rides${query(q)}`),
    get: (id2) => request(`/api/rides/${encodeURIComponent(id2)}`),
    create: (input) => request("/api/rides", {
      method: "POST",
      body: JSON.stringify(input)
    }),
    requestSeat: (rideId, input) => request(`/api/rides/${encodeURIComponent(rideId)}/request`, {
      method: "POST",
      body: JSON.stringify(input)
    }),
    bookInstant: (rideId, input) => request(`/api/rides/${encodeURIComponent(rideId)}/book`, {
      method: "POST",
      body: JSON.stringify(input)
    }),
    listRequests: (rideId) => request(
      `/api/rides/${encodeURIComponent(rideId)}/requests`
    ),
    updateRequest: (rideId, requestId, status) => request(
      `/api/rides/${encodeURIComponent(rideId)}/request/${encodeURIComponent(requestId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status })
      }
    ),
    cancel: (rideId) => request(`/api/rides/${encodeURIComponent(rideId)}`, { method: "DELETE" }),
    update: (rideId, patch) => request(`/api/rides/${encodeURIComponent(rideId)}`, {
      method: "PATCH",
      body: JSON.stringify(patch)
    }),
    listMine: () => request("/api/rides/mine"),
    confirmComplete: (rideId) => request(`/api/rides/${encodeURIComponent(rideId)}/complete`, { method: "POST" }),
    revokeComplete: (rideId) => request(`/api/rides/${encodeURIComponent(rideId)}/complete`, { method: "DELETE" }),
    getMyRequest: (rideId) => request(
      `/api/rides/${encodeURIComponent(rideId)}/my-request`
    ),
    confirmedPassengers: (rideId) => request(
      `/api/rides/${encodeURIComponent(rideId)}/confirmed-passengers`
    ),
    listChecklist: (rideId) => request(
      `/api/rides/${encodeURIComponent(rideId)}/checklist`
    ),
    createChecklistItem: (rideId, item) => request(
      `/api/rides/${encodeURIComponent(rideId)}/checklist`,
      {
        method: "POST",
        body: JSON.stringify(item)
      }
    ),
    confirmChecklistItem: (rideId, itemId) => request(
      `/api/rides/${encodeURIComponent(rideId)}/checklist/${encodeURIComponent(itemId)}`,
      { method: "PATCH" }
    )
  },
  venues: {
    list: () => request("/api/venues")
  },
  messages: {
    listRideThread: (rideId) => request(`/api/rides/${encodeURIComponent(rideId)}/messages`),
    postRideThread: (rideId, payload) => request(`/api/rides/${encodeURIComponent(rideId)}/messages`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
    listConcertChat: (concertId) => request(`/api/concerts/${encodeURIComponent(concertId)}/messages`),
    postConcertChat: (concertId, payload) => request(`/api/concerts/${encodeURIComponent(concertId)}/messages`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
    uploadPhoto: (file) => {
      const fd = new FormData();
      fd.append("photo", file);
      return request("/api/messages/upload", { method: "POST", body: fd });
    }
  },
  reviews: {
    list: (rideId) => request(`/api/rides/${encodeURIComponent(rideId)}/reviews`),
    create: (rideId, input) => request(`/api/rides/${encodeURIComponent(rideId)}/reviews`, {
      method: "POST",
      body: JSON.stringify(input)
    })
  },
  users: {
    get: (userId) => request(`/api/users/${encodeURIComponent(userId)}`),
    listReviews: (userId) => request(`/api/users/${encodeURIComponent(userId)}/reviews`)
  },
  fuel: {
    prices: () => request("/api/fuel-price")
  },
  reports: {
    create: (input) => request("/api/reports", {
      method: "POST",
      body: JSON.stringify(input)
    })
  },
  admin: {
    stats: () => request("/api/admin/stats"),
    me: () => request("/api/admin/me"),
    listReports: (status) => {
      const qs = status ? `?status=${status}` : "";
      return request(`/api/admin/reports${qs}`);
    },
    updateReport: (id2, status) => request(`/api/admin/reports/${encodeURIComponent(id2)}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
    listLicenseReviews: (status) => {
      const qs = status ? `?status=${status}` : "";
      return request(`/api/admin/license-reviews${qs}`);
    },
    approveLicenseReview: (id2) => request(`/api/admin/license-reviews/${encodeURIComponent(id2)}/approve`, {
      method: "POST"
    }),
    rejectLicenseReview: (id2, reason) => request(`/api/admin/license-reviews/${encodeURIComponent(id2)}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason })
    }),
    banUser: (id2, reason) => request(`/api/admin/users/${encodeURIComponent(id2)}/ban`, {
      method: "POST",
      body: JSON.stringify({ reason })
    }),
    unbanUser: (id2) => request(`/api/admin/users/${encodeURIComponent(id2)}/unban`, {
      method: "POST"
    }),
    auditLog: (limit = 50) => request(`/api/admin/audit-log?limit=${limit}`)
  },
  favorites: {
    list: () => request("/api/favorites"),
    add: (kind, target_id, label) => request("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ kind, target_id, label })
    }),
    remove: (kind, target_id) => request(`/api/favorites/${kind}/${encodeURIComponent(target_id)}`, {
      method: "DELETE"
    })
  },
  alerts: {
    subscribeFestival: (email, festival_slug) => request("/api/alerts/festival", {
      method: "POST",
      body: JSON.stringify({ email, festival_slug })
    })
  }
};
const ANALYTICS_CONSENT_KEY = "cr_analytics_consent_v1";
function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}
function initPostHogIfAllowed() {
  if (!hasAnalyticsConsent()) return;
  return;
}
initPostHogIfAllowed();
function track(event, properties) {
  return;
}
function identify(userId, properties) {
  return;
}
const SessionContext = createContext(null);
function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const res = await api.auth.me();
      setUser(res.user);
      if (res.user) {
        identify(res.user.id, {
          home_city: res.user.home_city ?? void 0,
          verified: res.user.verified,
          license_verified: res.user.license_verified
        });
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
    }
    setUser(null);
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return /* @__PURE__ */ jsx(SessionContext.Provider, { value: { user, loading, refresh, logout }, children });
}
function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
const DATE_FMT = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});
const TIME_FMT = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Madrid"
});
const DAY_FMT = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short"
});
const formatDate = (iso) => DATE_FMT.format(new Date(iso));
const formatTime$1 = (iso) => TIME_FMT.format(new Date(iso));
const formatDay = (iso) => DAY_FMT.format(new Date(iso));
function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => {
    var _a2;
    return ((_a2 = part[0]) == null ? void 0 : _a2.toUpperCase()) ?? "";
  }).join("");
}
function TopNav() {
  const { user, loading, logout } = useSession();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      var _a2;
      if (!((_a2 = ref.current) == null ? void 0 : _a2.contains(e.target))) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  if (loading) return null;
  const next = encodeURIComponent(location.pathname + location.search);
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      ref,
      className: "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 bg-cr-bg/90 backdrop-blur border-b border-cr-border font-sans text-xs",
      children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: "font-display text-sm uppercase tracking-[0.08em] hover:text-cr-primary transition-colors",
            children: [
              "Concert",
              /* @__PURE__ */ jsx("span", { className: "text-cr-primary", children: "Ride" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/concerts",
              className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Conciertos"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales",
              className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Festivales"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/blog",
              className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Blog"
            }
          )
        ] }),
        user ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setOpen((v) => !v),
              "aria-haspopup": "menu",
              "aria-expanded": open,
              className: "inline-flex items-center gap-2 bg-cr-surface/85 backdrop-blur border border-cr-border hover:border-cr-primary text-cr-text hover:text-cr-primary pl-2 pr-3 py-1.5 transition-colors",
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "w-6 h-6 rounded-full bg-cr-primary text-black font-mono text-[10px] flex items-center justify-center",
                    children: initials(user.name)
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "font-semibold uppercase tracking-[0.12em] hidden sm:inline", children: user.name.split(" ")[0] })
              ]
            }
          ),
          open && /* @__PURE__ */ jsxs(
            "div",
            {
              role: "menu",
              className: "absolute right-0 mt-2 min-w-[200px] bg-cr-surface border border-cr-border divide-y divide-cr-border shadow-[0_0_24px_rgb(0_0_0_/_0.6)]",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 space-y-0.5", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-cr-text truncate", children: user.email }),
                  /* @__PURE__ */ jsxs("p", { className: "font-sans text-[10px] uppercase tracking-[0.12em] text-cr-text-muted", children: [
                    user.rides_given,
                    " viajes · ★ ",
                    user.rating.toFixed(1)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/publish",
                    onClick: () => setOpen(false),
                    role: "menuitem",
                    className: "flex items-center gap-2 px-4 py-2.5 hover:bg-cr-surface-2 hover:text-cr-primary",
                    children: [
                      /* @__PURE__ */ jsx(User, { size: 12, "aria-hidden": "true" }),
                      " Publicar un viaje"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/mis-viajes",
                    onClick: () => setOpen(false),
                    role: "menuitem",
                    className: "flex items-center gap-2 px-4 py-2.5 hover:bg-cr-surface-2 hover:text-cr-primary",
                    children: [
                      /* @__PURE__ */ jsx(TicketCheck, { size: 12, "aria-hidden": "true" }),
                      " Mis viajes"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/favoritos",
                    onClick: () => setOpen(false),
                    role: "menuitem",
                    className: "flex items-center gap-2 px-4 py-2.5 hover:bg-cr-surface-2 hover:text-cr-primary",
                    children: [
                      /* @__PURE__ */ jsx(Heart, { size: 12, "aria-hidden": "true" }),
                      " Favoritos"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/profile",
                    onClick: () => setOpen(false),
                    role: "menuitem",
                    className: "flex items-center gap-2 px-4 py-2.5 hover:bg-cr-surface-2 hover:text-cr-primary",
                    children: [
                      /* @__PURE__ */ jsx(Settings, { size: 12, "aria-hidden": "true" }),
                      " Mi perfil"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    onClick: async () => {
                      setOpen(false);
                      await logout();
                    },
                    className: "w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-cr-surface-2 hover:text-cr-secondary",
                    children: [
                      /* @__PURE__ */ jsx(LogOut, { size: 12, "aria-hidden": "true" }),
                      " Cerrar sesión"
                    ]
                  }
                )
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsx(
          Link,
          {
            to: `/login${next !== "%2F" ? `?next=${next}` : ""}`,
            className: "inline-flex items-center gap-1.5 bg-cr-surface/85 backdrop-blur border border-cr-border hover:border-cr-primary text-cr-text hover:text-cr-primary px-3 py-1.5 font-semibold uppercase tracking-[0.12em] transition-colors",
            children: "Entrar"
          }
        )
      ]
    }
  );
}
function Footer() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsxs("footer", { className: "border-t border-cr-border bg-cr-bg text-cr-text", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-display text-lg uppercase tracking-[0.06em]", children: [
          "Concert",
          /* @__PURE__ */ jsx("span", { className: "text-cr-primary", children: "Ride" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted leading-relaxed max-w-xs", children: "La plataforma de viajes compartidos a conciertos en España. Sin intermediarios, sin comisiones." }),
        /* @__PURE__ */ jsxs("p", { className: "font-mono text-xs text-cr-text-muted", children: [
          "¿Dudas o incidencias?",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "text-cr-primary hover:text-cr-primary/80 underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-4", children: "Plataforma" }),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/concerts",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Explorar conciertos"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/publish",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Publicar un viaje"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/register",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Crear cuenta"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/como-funciona",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Cómo funciona"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/rutas",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Rutas de carpooling"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/guia-transporte-festivales",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Guía de transporte"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/faq",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Preguntas frecuentes"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/blog",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Blog"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/prensa",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Prensa"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/acerca-de",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Acerca de"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contacto",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Contacto"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-4", children: "Festivales" }),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/mad-cool",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Mad Cool"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/primavera-sound",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Primavera Sound"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/sonar",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Sónar"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/fib",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "FIB Benicàssim"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/bbk-live",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "BBK Live"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/resurrection-fest",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Resurrection Fest"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/vina-rock",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Viña Rock"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/festivales/arenal-sound",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              children: "Arenal Sound"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-4", children: "Legal" }),
        /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/privacidad",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              title: "Política de privacidad GDPR",
              children: "Política de privacidad"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/terminos",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              title: "Términos y condiciones de uso",
              children: "Términos y condiciones"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/aviso-legal",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              title: "Aviso legal e información adicional",
              children: "Aviso legal"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/cookies",
              className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
              title: "Política de cookies y seguimiento",
              children: "Política de cookies"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-cr-border", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-cr-text-muted", children: [
          "© ",
          year,
          " ConcertRide ES. Todos los derechos reservados."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-cr-text-muted mt-1", children: [
          "GDPR/Datos:",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com?subject=SOLICITUD%20GDPR",
              className: "hover:text-cr-primary transition-colors underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-cr-text-muted flex flex-wrap gap-x-2 gap-y-1", children: [
        /* @__PURE__ */ jsx("span", { children: "Datos:" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://developer.ticketmaster.com",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-cr-primary transition-colors",
            children: "Ticketmaster"
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "·" }),
        /* @__PURE__ */ jsx("span", { children: "Mapas:" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://www.openstreetmap.org/copyright",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-cr-primary transition-colors",
            children: "OpenStreetMap contributors"
          }
        ),
        /* @__PURE__ */ jsx("span", { children: "·" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://carto.com/attributions",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "hover:text-cr-primary transition-colors",
            children: "CARTO"
          }
        )
      ] })
    ] }) })
  ] });
}
const FavoritesContext = createContext(null);
function normalise(kind, targetId) {
  return kind === "concert" ? targetId : targetId.trim().toLowerCase();
}
function FavoritesProvider({ children }) {
  const { user } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setUpcomingConcerts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.favorites.list();
      setFavorites(res.favorites);
      setUpcomingConcerts(res.upcoming_concerts);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const index = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const f of favorites) set.add(`${f.kind}:${f.target_id}`);
    return set;
  }, [favorites]);
  const has = useCallback(
    (kind, targetId) => index.has(`${kind}:${normalise(kind, targetId)}`),
    [index]
  );
  const toggle = useCallback(
    async (kind, targetId, label) => {
      if (!user) return false;
      const id2 = normalise(kind, targetId);
      const key = `${kind}:${id2}`;
      const currentlyFav = index.has(key);
      if (currentlyFav) {
        const prev = favorites;
        setFavorites((list) => list.filter((f) => !(f.kind === kind && f.target_id === id2)));
        try {
          await api.favorites.remove(kind, id2);
          track("favorite_removed", { kind, target_id: id2 });
          void refresh();
          return false;
        } catch {
          setFavorites(prev);
          return true;
        }
      } else {
        const temp = {
          id: `tmp_${Math.random().toString(36).slice(2, 10)}`,
          kind,
          target_id: id2,
          label,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        setFavorites((list) => [temp, ...list]);
        try {
          const saved = await api.favorites.add(kind, id2, label);
          setFavorites((list) => list.map((f) => f.id === temp.id ? saved : f));
          track("favorite_added", { kind, target_id: id2 });
          void refresh();
          return true;
        } catch {
          setFavorites((list) => list.filter((f) => f.id !== temp.id));
          return false;
        }
      }
    },
    [user, index, favorites, refresh]
  );
  return /* @__PURE__ */ jsx(FavoritesContext.Provider, { value: { favorites, upcomingConcerts, loading, has, toggle, refresh }, children });
}
function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
const __vite_import_meta_env__ = {};
const SITE_URL = ((_a = __vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_SITE_URL) == null ? void 0 : _a.replace(/\/+$/, "")) || "https://concertride.me";
const DEFAULT_DESCRIPTION = "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/home.png`;
const DEFAULT_OG_IMAGE_WIDTH = 1200;
const DEFAULT_OG_IMAGE_HEIGHT = 630;
const SITE_NAME = "ConcertRide ES";
const TWITTER_SITE = "@concertride_es";
const OG_LOCALE = "es_ES";
const isBrowser$1 = typeof window !== "undefined" && typeof document !== "undefined";
function resolve(meta) {
  const fullTitle = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} — ${SITE_NAME}`;
  return {
    title: meta.title,
    fullTitle,
    description: meta.description || DEFAULT_DESCRIPTION,
    canonical: meta.canonical,
    keywords: meta.keywords,
    ogTitle: meta.ogTitle ?? meta.title,
    ogDescription: meta.ogDescription ?? meta.description ?? DEFAULT_DESCRIPTION,
    ogImage: meta.ogImage || DEFAULT_OG_IMAGE,
    ogImageWidth: meta.ogImageWidth ?? DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: meta.ogImageHeight ?? DEFAULT_OG_IMAGE_HEIGHT,
    ogType: meta.ogType ?? "website",
    noindex: meta.noindex ?? false,
    articleAuthor: meta.articleAuthor,
    articlePublishedTime: meta.articlePublishedTime,
    articleModifiedTime: meta.articleModifiedTime,
    articleSection: meta.articleSection
  };
}
function setMeta(name, content, prop = false) {
  const attr = prop ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function removeMeta(name, prop = false) {
  const attr = prop ? "property" : "name";
  const el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}
function setLink(rel, href, extraAttrs) {
  const selector = extraAttrs ? `link[rel="${rel}"]${Object.entries(extraAttrs).map(([k, v]) => `[${k}="${v}"]`).join("")}` : `link[rel="${rel}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (extraAttrs) Object.entries(extraAttrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}
function useSeoMeta(meta) {
  if (!isBrowser$1) {
    globalThis.__concertrideSsrSeo = resolve(meta);
  }
  useEffect(() => {
    const r = resolve(meta);
    document.title = r.fullTitle;
    const ogUrl = r.canonical ?? window.location.origin + window.location.pathname;
    setMeta("description", r.description);
    setMeta(
      "robots",
      r.noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    );
    if (r.keywords) setMeta("keywords", r.keywords);
    setMeta("og:locale", OG_LOCALE, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:type", r.ogType, true);
    setMeta("og:url", ogUrl, true);
    setMeta("og:title", r.ogTitle, true);
    setMeta("og:description", r.ogDescription, true);
    setMeta("og:image", r.ogImage, true);
    setMeta("og:image:secure_url", r.ogImage, true);
    setMeta("og:image:width", String(r.ogImageWidth), true);
    setMeta("og:image:height", String(r.ogImageHeight), true);
    setMeta("og:image:type", "image/png", true);
    setMeta("og:image:alt", `${r.ogTitle} — ${SITE_NAME}`, true);
    if (r.ogType === "article" && r.articlePublishedTime) {
      setMeta("article:published_time", r.articlePublishedTime, true);
      if (r.articleModifiedTime) setMeta("article:modified_time", r.articleModifiedTime, true);
      if (r.articleAuthor) setMeta("article:author", r.articleAuthor, true);
      if (r.articleSection) setMeta("article:section", r.articleSection, true);
      setMeta("article:publisher", "https://www.facebook.com/concertride.me", true);
    } else {
      removeMeta("article:published_time", true);
      removeMeta("article:modified_time", true);
      removeMeta("article:author", true);
      removeMeta("article:section", true);
      removeMeta("article:publisher", true);
    }
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", TWITTER_SITE);
    setMeta("twitter:creator", TWITTER_SITE);
    setMeta("twitter:title", r.ogTitle);
    setMeta("twitter:description", r.ogDescription);
    setMeta("twitter:image", r.ogImage);
    setMeta("twitter:image:alt", `${r.ogTitle} — ${SITE_NAME}`);
    if (r.canonical) {
      setLink("canonical", r.canonical);
      setLink("alternate", r.canonical, { hreflang: "es-ES" });
      setLink("alternate", r.canonical, { hreflang: "x-default" });
    }
  }, [
    meta.title,
    meta.description,
    meta.canonical,
    meta.keywords,
    meta.ogTitle,
    meta.ogDescription,
    meta.ogImage,
    meta.ogImageWidth,
    meta.ogImageHeight,
    meta.ogType,
    meta.noindex,
    meta.articleAuthor,
    meta.articlePublishedTime,
    meta.articleModifiedTime,
    meta.articleSection
  ]);
}
const LayoutGroupContext = createContext({});
function useConstant(init) {
  const ref = useRef(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
}
const PresenceContext = createContext(null);
const MotionConfigContext = createContext({
  transformPagePoint: (p) => p,
  isStatic: false,
  reducedMotion: "never"
});
class PopChildMeasure extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (element && prevProps.isPresent && !this.props.isPresent) {
      const size = this.props.sizeRef.current;
      size.height = element.offsetHeight || 0;
      size.width = element.offsetWidth || 0;
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent }) {
  const id2 = useId();
  const ref = useRef(null);
  const size = useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  });
  const { nonce } = useContext(MotionConfigContext);
  useInsertionEffect(() => {
    const { width, height, top, left } = size.current;
    if (isPresent || !ref.current || !width || !height)
      return;
    ref.current.dataset.motionPopId = id2;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    document.head.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            top: ${top}px !important;
            left: ${left}px !important;
          }
        `);
    }
    return () => {
      document.head.removeChild(style);
    };
  }, [isPresent]);
  return jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, children: React.cloneElement(children, { ref }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id2 = useId();
  const memoizedOnExitComplete = useCallback((childId) => {
    presenceChildren.set(childId, true);
    for (const isComplete of presenceChildren.values()) {
      if (!isComplete)
        return;
    }
    onExitComplete && onExitComplete();
  }, [presenceChildren, onExitComplete]);
  const context = useMemo(
    () => ({
      id: id2,
      initial,
      isPresent,
      custom,
      onExitComplete: memoizedOnExitComplete,
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    }),
    /**
     * If the presence of a child affects the layout of the components around it,
     * we want to make a new context value to ensure they get re-rendered
     * so they can detect that layout change.
     */
    presenceAffectsLayout ? [Math.random(), memoizedOnExitComplete] : [isPresent, memoizedOnExitComplete]
  );
  useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  React.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  if (mode === "popLayout") {
    children = jsx(PopChild, { isPresent, children });
  }
  return jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
function usePresence(subscribe = true) {
  const context = useContext(PresenceContext);
  if (context === null)
    return [true, null];
  const { isPresent, onExitComplete, register } = context;
  const id2 = useId();
  useEffect(() => {
    if (subscribe)
      register(id2);
  }, [subscribe]);
  const safeToRemove = useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const isBrowser = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = useRef(true);
  const pendingPresentChildren = useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const [diffedChildren, setDiffedChildren] = useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return;
  }
  if (process.env.NODE_ENV !== "production" && mode === "wait" && renderedChildren.length > 1) {
    console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
  }
  const { forceRender } = useContext(LayoutGroupContext);
  return jsx(Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitComplete.has(key)) {
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender === null || forceRender === void 0 ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove === null || safeToRemove === void 0 ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom: isPresent ? void 0 : custom, presenceAffectsLayout, mode, onExitComplete: isPresent ? void 0 : onExit, children: child }, key);
  }) });
};
const noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
let warning = noop;
let invariant = noop;
if (process.env.NODE_ENV !== "production") {
  warning = (check, message) => {
    if (!check && typeof console !== "undefined") {
      console.warn(message);
    }
  };
  invariant = (check, message) => {
    if (!check) {
      throw new Error(message);
    }
  };
}
const MotionGlobalConfig = {
  useManualTiming: false
};
function createRenderStep(runNextFrame) {
  let thisFrame = /* @__PURE__ */ new Set();
  let nextFrame = /* @__PURE__ */ new Set();
  let isProcessing = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  function triggerCallback(callback) {
    if (toKeepAlive.has(callback)) {
      step.schedule(callback);
      runNextFrame();
    }
    callback(latestFrameData);
  }
  const step = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing;
      const queue = addToCurrentFrame ? thisFrame : nextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      if (!queue.has(callback))
        queue.add(callback);
      return callback;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (callback) => {
      nextFrame.delete(callback);
      toKeepAlive.delete(callback);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (frameData2) => {
      latestFrameData = frameData2;
      if (isProcessing) {
        flushNextFrame = true;
        return;
      }
      isProcessing = true;
      [thisFrame, nextFrame] = [nextFrame, thisFrame];
      thisFrame.forEach(triggerCallback);
      thisFrame.clear();
      isProcessing = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData2);
      }
    }
  };
  return step;
}
const stepsOrder = [
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
const maxElapsed$1 = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = false;
  let useDefaultElapsed = true;
  const state = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  const flagRunNextFrame = () => runNextFrame = true;
  const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(flagRunNextFrame);
    return acc;
  }, {});
  const { read, resolveKeyframes, update, preRender, render: render2, postRender } = steps;
  const processBatch = () => {
    const timestamp = performance.now();
    runNextFrame = false;
    state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed$1), 1);
    state.timestamp = timestamp;
    state.isProcessing = true;
    read.process(state);
    resolveKeyframes.process(state);
    update.process(state);
    preRender.process(state);
    render2.process(state);
    postRender.process(state);
    state.isProcessing = false;
    if (runNextFrame && allowKeepAlive) {
      useDefaultElapsed = false;
      scheduleNextBatch(processBatch);
    }
  };
  const wake = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!state.isProcessing) {
      scheduleNextBatch(processBatch);
    }
  };
  const schedule = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process2, keepAlive = false, immediate = false) => {
      if (!runNextFrame)
        wake();
      return step.schedule(process2, keepAlive, immediate);
    };
    return acc;
  }, {});
  const cancel = (process2) => {
    for (let i = 0; i < stepsOrder.length; i++) {
      steps[stepsOrder[i]].cancel(process2);
    }
  };
  return { schedule, cancel, state, steps };
}
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
const LazyContext = createContext({ strict: false });
const featureProps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
const featureDefinitions = {};
for (const key in featureProps) {
  featureDefinitions[key] = {
    isEnabled: (props) => featureProps[key].some((name) => !!props[name])
  };
}
function loadFeatures(features) {
  for (const key in features) {
    featureDefinitions[key] = {
      ...featureDefinitions[key],
      ...features[key]
    };
  }
}
const validMotionProps = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function isValidMotionProp(key) {
  return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}
let shouldForward = (key) => !isValidMotionProp(key);
function loadExternalIsValidProp(isValidProp) {
  if (!isValidProp)
    return;
  shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
try {
  loadExternalIsValidProp(require("@emotion/is-prop-valid").default);
} catch (_a2) {
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key in props) {
    if (key === "values" && typeof props.values === "object")
      continue;
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || // If trying to use native HTML drag events, forward drag listeners
    props["draggable"] && key.startsWith("onDrag")) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}
const warned = /* @__PURE__ */ new Set();
function warnOnce(condition, message, element) {
  if (condition || warned.has(message))
    return;
  console.warn(message);
  warned.add(message);
}
function createDOMMotionComponentProxy(componentFactory) {
  if (typeof Proxy === "undefined") {
    return componentFactory;
  }
  const componentCache = /* @__PURE__ */ new Map();
  const deprecatedFactoryFunction = (...args) => {
    if (process.env.NODE_ENV !== "production") {
      warnOnce(false, "motion() is deprecated. Use motion.create() instead.");
    }
    return componentFactory(...args);
  };
  return new Proxy(deprecatedFactoryFunction, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key) => {
      if (key === "create")
        return componentFactory;
      if (!componentCache.has(key)) {
        componentCache.set(key, componentFactory(key));
      }
      return componentCache.get(key);
    }
  });
}
const MotionContext = createContext({});
function isVariantLabel(v) {
  return typeof v === "string" || Array.isArray(v);
}
function isAnimationControls(v) {
  return v !== null && typeof v === "object" && typeof v.start === "function";
}
const variantPriorityOrder = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
];
const variantProps = ["initial", ...variantPriorityOrder];
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return Boolean(isControllingVariants(props) || props.variants);
}
function getCurrentTreeVariants(props, context) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== false ? context : {};
}
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, useContext(MotionContext));
  return useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}
const motionComponentSymbol = Symbol.for("motionComponentSymbol");
function isRefObject(ref) {
  return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
function useMotionRef(visualState, visualElement, externalRef) {
  return useCallback(
    (instance) => {
      if (instance) {
        visualState.onMount && visualState.onMount(instance);
      }
      if (visualElement) {
        if (instance) {
          visualElement.mount(instance);
        } else {
          visualElement.unmount();
        }
      }
      if (externalRef) {
        if (typeof externalRef === "function") {
          externalRef(instance);
        } else if (isRefObject(externalRef)) {
          externalRef.current = instance;
        }
      }
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [visualElement]
  );
}
const camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
const optimizedAppearDataId = "framerAppearId";
const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
const { schedule: microtask } = createRenderBatcher(queueMicrotask, false);
const SwitchLayoutGroupContext = createContext({});
function useVisualElement(Component2, visualState, props, createVisualElement, ProjectionNodeConstructor) {
  var _a2, _b;
  const { visualElement: parent } = useContext(MotionContext);
  const lazyContext = useContext(LazyContext);
  const presenceContext = useContext(PresenceContext);
  const reducedMotionConfig = useContext(MotionConfigContext).reducedMotion;
  const visualElementRef = useRef(null);
  createVisualElement = createVisualElement || lazyContext.renderer;
  if (!visualElementRef.current && createVisualElement) {
    visualElementRef.current = createVisualElement(Component2, {
      visualState,
      parent,
      props,
      presenceContext,
      blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
      reducedMotionConfig
    });
  }
  const visualElement = visualElementRef.current;
  const initialLayoutGroupConfig = useContext(SwitchLayoutGroupContext);
  if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
    createProjectionNode$1(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  }
  const isMounted = useRef(false);
  useInsertionEffect(() => {
    if (visualElement && isMounted.current) {
      visualElement.update(props, presenceContext);
    }
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute];
  const wantsHandoff = useRef(Boolean(optimisedAppearId) && !((_a2 = window.MotionHandoffIsComplete) === null || _a2 === void 0 ? void 0 : _a2.call(window, optimisedAppearId)) && ((_b = window.MotionHasOptimisedAnimation) === null || _b === void 0 ? void 0 : _b.call(window, optimisedAppearId)));
  useIsomorphicLayoutEffect(() => {
    if (!visualElement)
      return;
    isMounted.current = true;
    window.MotionIsMounted = true;
    visualElement.updateFeatures();
    microtask.render(visualElement.render);
    if (wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  });
  useEffect(() => {
    if (!visualElement)
      return;
    if (!wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
    if (wantsHandoff.current) {
      queueMicrotask(() => {
        var _a3;
        (_a3 = window.MotionHandoffMarkAsComplete) === null || _a3 === void 0 ? void 0 : _a3.call(window, optimisedAppearId);
      });
      wantsHandoff.current = false;
    }
  });
  return visualElement;
}
function createProjectionNode$1(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
  visualElement.projection.setOptions({
    layoutId,
    layout: layout2,
    alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof layout2 === "string" ? layout2 : "both",
    initialPromotionConfig,
    layoutScroll,
    layoutRoot
  });
}
function getClosestProjectingNode(visualElement) {
  if (!visualElement)
    return void 0;
  return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
function createRendererMotionComponent({ preloadedFeatures, createVisualElement, useRender, useVisualState, Component: Component2 }) {
  var _a2, _b;
  preloadedFeatures && loadFeatures(preloadedFeatures);
  function MotionComponent(props, externalRef) {
    let MeasureLayout2;
    const configAndProps = {
      ...useContext(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    };
    const { isStatic } = configAndProps;
    const context = useCreateMotionContext(props);
    const visualState = useVisualState(props, isStatic);
    if (!isStatic && isBrowser) {
      useStrictMode(configAndProps, preloadedFeatures);
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout2 = layoutProjection.MeasureLayout;
      context.visualElement = useVisualElement(Component2, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode);
    }
    return jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component2, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, context.visualElement)] });
  }
  MotionComponent.displayName = `motion.${typeof Component2 === "string" ? Component2 : `create(${(_b = (_a2 = Component2.displayName) !== null && _a2 !== void 0 ? _a2 : Component2.name) !== null && _b !== void 0 ? _b : ""})`}`;
  const ForwardRefMotionComponent = forwardRef(MotionComponent);
  ForwardRefMotionComponent[motionComponentSymbol] = Component2;
  return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = useContext(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  const isStrict = useContext(LazyContext).strict;
  if (process.env.NODE_ENV !== "production" && preloadedFeatures && isStrict) {
    const strictMessage = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    configAndProps.ignoreStrict ? warning(false, strictMessage) : invariant(false, strictMessage);
  }
}
function getProjectionFunctionality(props) {
  const { drag: drag2, layout: layout2 } = featureDefinitions;
  if (!drag2 && !layout2)
    return {};
  const combined = { ...drag2, ...layout2 };
  return {
    MeasureLayout: (drag2 === null || drag2 === void 0 ? void 0 : drag2.isEnabled(props)) || (layout2 === null || layout2 === void 0 ? void 0 : layout2.isEnabled(props)) ? combined.MeasureLayout : void 0,
    ProjectionNode: combined.ProjectionNode
  };
}
const lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function isSVGComponent(Component2) {
  if (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component2 !== "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    Component2.includes("-")
  ) {
    return false;
  } else if (
    /**
     * If it's in our list of lowercase SVG tags, it's an SVG component
     */
    lowercaseSVGElements.indexOf(Component2) > -1 || /**
     * If it contains a capital letter, it's an SVG component
     */
    /[A-Z]/u.test(Component2)
  ) {
    return true;
  }
  return false;
}
function getValueState(visualElement) {
  const state = [{}, {}];
  visualElement === null || visualElement === void 0 ? void 0 : visualElement.values.forEach((value, key) => {
    state[0][key] = value.get();
    state[1][key] = value.getVelocity();
  });
  return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  if (typeof definition === "string") {
    definition = props.variants && props.variants[definition];
  }
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  return definition;
}
const isKeyframesTarget = (v) => {
  return Array.isArray(v);
};
const isCustomValue = (v) => {
  return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
const resolveFinalValueInKeyframes = (v) => {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
};
const isMotionValue = (value) => Boolean(value && value.getVelocity);
function resolveMotionValue(value) {
  const unwrappedValue = isMotionValue(value) ? value.get() : value;
  return isCustomValue(unwrappedValue) ? unwrappedValue.toValue() : unwrappedValue;
}
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState, onUpdate }, props, context, presenceContext) {
  const state = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
    renderState: createRenderState()
  };
  if (onUpdate) {
    state.onMount = (instance) => onUpdate({ props, current: instance, ...state });
    state.onUpdate = (visualElement) => onUpdate(visualElement);
  }
  return state;
}
const makeUseVisualState = (config) => (props, isStatic) => {
  const context = useContext(MotionContext);
  const presenceContext = useContext(PresenceContext);
  const make = () => makeState(config, props, context, presenceContext);
  return isStatic ? make() : useConstant(make);
};
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props);
  const isVariantNode$1 = isVariantNode(props);
  if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
    if (initial === void 0)
      initial = context.initial;
    if (animate === void 0)
      animate = context.animate;
  }
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0; i < list.length; i++) {
      const resolved = resolveVariantFromProps(props, list[i]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key];
          if (Array.isArray(valueTarget)) {
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index];
          }
          if (valueTarget !== null) {
            values[key] = valueTarget;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key];
        }
      }
    }
  }
  return values;
}
const transformPropOrder = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
];
const transformProps = new Set(transformPropOrder);
const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
const isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
const startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
const isCSSVariableToken = (value) => {
  const startsWithToken = startsAsVariableToken(value);
  if (!startsWithToken)
    return false;
  return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
const getValueAsType = (value, type) => {
  return type && typeof value === "number" ? type.transform(value) : value;
};
const clamp = (min, max, v) => {
  if (v > max)
    return max;
  if (v < min)
    return min;
  return v;
};
const number = {
  test: (v) => typeof v === "number",
  parse: parseFloat,
  transform: (v) => v
};
const alpha = {
  ...number,
  transform: (v) => clamp(0, 1, v)
};
const scale = {
  ...number,
  default: 1
};
const createUnitType = (unit) => ({
  test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
});
const degrees = /* @__PURE__ */ createUnitType("deg");
const percent = /* @__PURE__ */ createUnitType("%");
const px = /* @__PURE__ */ createUnitType("px");
const vh = /* @__PURE__ */ createUnitType("vh");
const vw = /* @__PURE__ */ createUnitType("vw");
const progressPercentage = {
  ...percent,
  parse: (v) => percent.parse(v) / 100,
  transform: (v) => percent.transform(v * 100)
};
const browserNumberValueTypes = {
  // Border props
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  // Misc
  backgroundPositionX: px,
  backgroundPositionY: px
};
const transformValueTypes = {
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px
};
const int = {
  ...number,
  transform: Math.round
};
const numberValueTypes = {
  ...browserNumberValueTypes,
  ...transformValueTypes,
  zIndex: int,
  size: px,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
const numTransforms = transformPropOrder.length;
function buildTransform(latestValues, transform2, transformTemplate) {
  let transformString = "";
  let transformIsDefault = true;
  for (let i = 0; i < numTransforms; i++) {
    const key = transformPropOrder[i];
    const value = latestValues[key];
    if (value === void 0)
      continue;
    let valueIsDefault = true;
    if (typeof value === "number") {
      valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
    } else {
      valueIsDefault = parseFloat(value) === 0;
    }
    if (!valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias[key] || key;
        transformString += `${transformName}(${valueAsType}) `;
      }
      if (transformTemplate) {
        transform2[key] = valueAsType;
      }
    }
  }
  transformString = transformString.trim();
  if (transformTemplate) {
    transformString = transformTemplate(transform2, transformIsDefault ? "" : transformString);
  } else if (transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}
function buildHTMLStyles(state, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state;
  let hasTransform2 = false;
  let hasTransformOrigin = false;
  for (const key in latestValues) {
    const value = latestValues[key];
    if (transformProps.has(key)) {
      hasTransform2 = true;
      continue;
    } else if (isCSSVariableName(key)) {
      vars[key] = value;
      continue;
    } else {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (key.startsWith("origin")) {
        hasTransformOrigin = true;
        transformOrigin[key] = valueAsType;
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (!latestValues.transform) {
    if (hasTransform2 || transformTemplate) {
      style.transform = buildTransform(latestValues, state.transform, transformTemplate);
    } else if (style.transform) {
      style.transform = "none";
    }
  }
  if (hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}
const dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
};
const camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
  attrs.pathLength = 1;
  const keys2 = useDashCase ? dashKeys : camelKeys;
  attrs[keys2.offset] = px.transform(-offset);
  const pathLength = px.transform(length);
  const pathSpacing = px.transform(spacing);
  attrs[keys2.array] = `${pathLength} ${pathSpacing}`;
}
function calcOrigin$1(origin, offset, size) {
  return typeof origin === "string" ? origin : px.transform(offset + size * origin);
}
function calcSVGTransformOrigin(dimensions, originX, originY) {
  const pxOriginX = calcOrigin$1(originX, dimensions.x, dimensions.width);
  const pxOriginY = calcOrigin$1(originY, dimensions.y, dimensions.height);
  return `${pxOriginX} ${pxOriginY}`;
}
function buildSVGAttrs(state, {
  attrX,
  attrY,
  attrScale,
  originX,
  originY,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  // This is object creation, which we try to avoid per-frame.
  ...latest
}, isSVGTag2, transformTemplate) {
  buildHTMLStyles(state, latest, transformTemplate);
  if (isSVGTag2) {
    if (state.style.viewBox) {
      state.attrs.viewBox = state.style.viewBox;
    }
    return;
  }
  state.attrs = state.style;
  state.style = {};
  const { attrs, style, dimensions } = state;
  if (attrs.transform) {
    if (dimensions)
      style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (dimensions && (originX !== void 0 || originY !== void 0 || style.transform)) {
    style.transformOrigin = calcSVGTransformOrigin(dimensions, originX !== void 0 ? originX : 0.5, originY !== void 0 ? originY : 0.5);
  }
  if (attrX !== void 0)
    attrs.x = attrX;
  if (attrY !== void 0)
    attrs.y = attrY;
  if (attrScale !== void 0)
    attrs.scale = attrScale;
  if (pathLength !== void 0) {
    buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
  }
}
const createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
const createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
});
const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
function renderHTML(element, { style, vars }, styleProp, projection) {
  Object.assign(element.style, style, projection && projection.getProjectionStyles(styleProp));
  for (const key in vars) {
    element.style.setProperty(key, vars[key]);
  }
}
const camelCaseAttributes = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, void 0, projection);
  for (const key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}
const scaleCorrectors = {};
function addScaleCorrector(correctors) {
  Object.assign(scaleCorrectors, correctors);
}
function isForcedMotionValue(key, { layout: layout2, layoutId }) {
  return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
  var _a2;
  const { style } = props;
  const newValues = {};
  for (const key in style) {
    if (isMotionValue(style[key]) || prevProps.style && isMotionValue(prevProps.style[key]) || isForcedMotionValue(key, props) || ((_a2 = visualElement === null || visualElement === void 0 ? void 0 : visualElement.getValue(key)) === null || _a2 === void 0 ? void 0 : _a2.liveStyle) !== void 0) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  for (const key in props) {
    if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
      const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}
function updateSVGDimensions(instance, renderState) {
  try {
    renderState.dimensions = typeof instance.getBBox === "function" ? instance.getBBox() : instance.getBoundingClientRect();
  } catch (e) {
    renderState.dimensions = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
}
const layoutProps = ["x", "y", "width", "height", "cx", "cy", "r"];
const svgMotionConfig = {
  useVisualState: makeUseVisualState({
    scrapeMotionValuesFromProps,
    createRenderState: createSvgRenderState,
    onUpdate: ({ props, prevProps, current, renderState, latestValues }) => {
      if (!current)
        return;
      let hasTransform2 = !!props.drag;
      if (!hasTransform2) {
        for (const key in latestValues) {
          if (transformProps.has(key)) {
            hasTransform2 = true;
            break;
          }
        }
      }
      if (!hasTransform2)
        return;
      let needsMeasure = !prevProps;
      if (prevProps) {
        for (let i = 0; i < layoutProps.length; i++) {
          const key = layoutProps[i];
          if (props[key] !== prevProps[key]) {
            needsMeasure = true;
          }
        }
      }
      if (!needsMeasure)
        return;
      frame.read(() => {
        updateSVGDimensions(current, renderState);
        frame.render(() => {
          buildSVGAttrs(renderState, latestValues, isSVGTag(current.tagName), props.transformTemplate);
          renderSVG(current, renderState);
        });
      });
    }
  })
};
const htmlMotionConfig = {
  useVisualState: makeUseVisualState({
    scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
    createRenderState: createHtmlRenderState
  })
};
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return useMemo(() => {
    const state = createHtmlRenderState();
    buildHTMLStyles(state, visualState, transformTemplate);
    return Object.assign({}, state.vars, state.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {};
  const style = {};
  copyRawValuesOnly(style, styleProp, props);
  Object.assign(style, useInitialMotionValues(props, visualState));
  return style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {};
  const style = useStyle(props, visualState);
  if (props.drag && props.dragListener !== false) {
    htmlProps.draggable = false;
    style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
    style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
  }
  if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
    htmlProps.tabIndex = 0;
  }
  htmlProps.style = style;
  return htmlProps;
}
function useSVGProps(props, visualState, _isStatic, Component2) {
  const visualProps = useMemo(() => {
    const state = createSvgRenderState();
    buildSVGAttrs(state, visualState, isSVGTag(Component2), props.transformTemplate);
    return {
      ...state.attrs,
      style: { ...state.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}
function createUseRender(forwardMotionProps = false) {
  const useRender = (Component2, props, ref, { latestValues }, isStatic) => {
    const useVisualProps = isSVGComponent(Component2) ? useSVGProps : useHTMLProps;
    const visualProps = useVisualProps(props, latestValues, isStatic, Component2);
    const filteredProps = filterProps(props, typeof Component2 === "string", forwardMotionProps);
    const elementProps = Component2 !== Fragment$1 ? { ...filteredProps, ...visualProps, ref } : {};
    const { children } = props;
    const renderedChildren = useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
    return createElement(Component2, {
      ...elementProps,
      children: renderedChildren
    });
  };
  return useRender;
}
function createMotionComponentFactory(preloadedFeatures, createVisualElement) {
  return function createMotionComponent2(Component2, { forwardMotionProps } = { forwardMotionProps: false }) {
    const baseConfig = isSVGComponent(Component2) ? svgMotionConfig : htmlMotionConfig;
    const config = {
      ...baseConfig,
      preloadedFeatures,
      useRender: createUseRender(forwardMotionProps),
      createVisualElement,
      Component: Component2
    };
    return createRendererMotionComponent(config);
  };
}
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return false;
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (let i = 0; i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}
function getValueTransition(transition, key) {
  return transition ? transition[key] || transition["default"] || transition : void 0;
}
const positionalKeys = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...transformPropOrder
]);
let now;
function clearTime() {
  now = void 0;
}
const time = {
  now: () => {
    if (now === void 0) {
      time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
    }
    return now;
  },
  set: (newTime) => {
    now = newTime;
    queueMicrotask(clearTime);
  }
};
function addUniqueItem(arr, item) {
  if (arr.indexOf(item) === -1)
    arr.push(item);
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1)
    arr.splice(index, 1);
}
class SubscriptionManager {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  }
  notify(a, b, c) {
    const numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      for (let i = 0; i < numSubscriptions; i++) {
        const handler = this.subscriptions[i];
        handler && handler(a, b, c);
      }
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
const MAX_VELOCITY_DELTA = 30;
const isFloat = (value) => {
  return !isNaN(parseFloat(value));
};
const collectMotionValues = {
  current: void 0
};
class MotionValue {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   *
   * @internal
   */
  constructor(init, options = {}) {
    this.version = "11.18.2";
    this.canTrackVelocity = null;
    this.events = {};
    this.updateAndNotify = (v, render2 = true) => {
      const currentTime = time.now();
      if (this.updatedAt !== currentTime) {
        this.setPrevFrameValue();
      }
      this.prev = this.current;
      this.setCurrent(v);
      if (this.current !== this.prev && this.events.change) {
        this.events.change.notify(this.current);
      }
      if (render2 && this.events.renderRequest) {
        this.events.renderRequest.notify(this.current);
      }
    };
    this.hasAnimated = false;
    this.setCurrent(init);
    this.owner = options.owner;
  }
  setCurrent(current) {
    this.current = current;
    this.updatedAt = time.now();
    if (this.canTrackVelocity === null && current !== void 0) {
      this.canTrackVelocity = isFloat(this.current);
    }
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue;
    this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription) {
    if (process.env.NODE_ENV !== "production") {
      warnOnce(false, `value.onChange(callback) is deprecated. Switch to value.on("change", callback).`);
    }
    return this.on("change", subscription);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    const unsubscribe = this.events[eventName].add(callback);
    if (eventName === "change") {
      return () => {
        unsubscribe();
        frame.read(() => {
          if (!this.events.change.getSize()) {
            this.stop();
          }
        });
      };
    }
    return unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events) {
      this.events[eventManagers].clear();
    }
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   *
   * @internal
   */
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect;
    this.stopPassiveEffect = stopPassiveEffect;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v, render2 = true) {
    if (!render2 || !this.passiveEffect) {
      this.updateAndNotify(v, render2);
    } else {
      this.passiveEffect(v, this.updateAndNotify);
    }
  }
  setWithVelocity(prev, current, delta) {
    this.set(current);
    this.prev = void 0;
    this.prevFrameValue = prev;
    this.prevUpdatedAt = this.updatedAt - delta;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v, endAnimation = true) {
    this.updateAndNotify(v);
    this.prev = v;
    this.prevUpdatedAt = this.prevFrameValue = void 0;
    endAnimation && this.stop();
    if (this.stopPassiveEffect)
      this.stopPassiveEffect();
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    if (collectMotionValues.current) {
      collectMotionValues.current.push(this);
    }
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const currentTime = time.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
      return 0;
    }
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   *
   * @internal
   */
  start(startAnimation) {
    this.stop();
    return new Promise((resolve2) => {
      this.hasAnimated = true;
      this.animation = startAnimation(resolve2);
      if (this.events.animationStart) {
        this.events.animationStart.notify();
      }
    }).then(() => {
      if (this.events.animationComplete) {
        this.events.animationComplete.notify();
      }
      this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    if (this.animation) {
      this.animation.stop();
      if (this.events.animationCancel) {
        this.events.animationCancel.notify();
      }
    }
    this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.clearListeners();
    this.stop();
    if (this.stopPassiveEffect) {
      this.stopPassiveEffect();
    }
  }
}
function motionValue(init, options) {
  return new MotionValue(init, options);
}
function setMotionValue(visualElement, key, value) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key).set(value);
  } else {
    visualElement.addValue(key, motionValue(value));
  }
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key in target) {
    const value = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement, key, value);
  }
}
function isWillChangeMotionValue(value) {
  return Boolean(isMotionValue(value) && value.add);
}
function addValueToWillChange(visualElement, key) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange)) {
    return willChange.add(key);
  }
}
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}
// @__NO_SIDE_EFFECTS__
function memo(callback) {
  let result;
  return () => {
    if (result === void 0)
      result = callback();
    return result;
  };
}
const supportsScrollTimeline = /* @__PURE__ */ memo(() => window.ScrollTimeline !== void 0);
class BaseGroupPlaybackControls {
  constructor(animations2) {
    this.stop = () => this.runAll("stop");
    this.animations = animations2.filter(Boolean);
  }
  get finished() {
    return Promise.all(this.animations.map((animation) => "finished" in animation ? animation.finished : animation));
  }
  /**
   * TODO: Filter out cancelled or stopped animations before returning
   */
  getAll(propName) {
    return this.animations[0][propName];
  }
  setAll(propName, newValue) {
    for (let i = 0; i < this.animations.length; i++) {
      this.animations[i][propName] = newValue;
    }
  }
  attachTimeline(timeline, fallback) {
    const subscriptions = this.animations.map((animation) => {
      if (supportsScrollTimeline() && animation.attachTimeline) {
        return animation.attachTimeline(timeline);
      } else if (typeof fallback === "function") {
        return fallback(animation);
      }
    });
    return () => {
      subscriptions.forEach((cancel, i) => {
        cancel && cancel();
        this.animations[i].stop();
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(time2) {
    this.setAll("time", time2);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(speed) {
    this.setAll("speed", speed);
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    let max = 0;
    for (let i = 0; i < this.animations.length; i++) {
      max = Math.max(max, this.animations[i].duration);
    }
    return max;
  }
  runAll(methodName) {
    this.animations.forEach((controls) => controls[methodName]());
  }
  flatten() {
    this.runAll("flatten");
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
class GroupPlaybackControls extends BaseGroupPlaybackControls {
  then(onResolve, onReject) {
    return Promise.all(this.animations).then(onResolve).catch(onReject);
  }
}
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
function isGenerator(type) {
  return typeof type === "function";
}
function attachTimeline(animation, timeline) {
  animation.timeline = timeline;
  animation.onfinish = null;
}
const isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
const supportsFlags = {
  linearEasing: void 0
};
function memoSupports(callback, supportsFlag) {
  const memoized = /* @__PURE__ */ memo(callback);
  return () => {
    var _a2;
    return (_a2 = supportsFlags[supportsFlag]) !== null && _a2 !== void 0 ? _a2 : memoized();
  };
}
const supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch (e) {
    return false;
  }
  return true;
}, "linearEasing");
const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
const generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i = 0; i < numPoints; i++) {
    points += easing(/* @__PURE__ */ progress(0, numPoints - 1, i)) + ", ";
  }
  return `linear(${points.substring(0, points.length - 2)})`;
};
function isWaapiSupportedEasing(easing) {
  return Boolean(typeof easing === "function" && supportsLinearEasing() || !easing || typeof easing === "string" && (easing in supportedWaapiEasing || supportsLinearEasing()) || isBezierDefinition(easing) || Array.isArray(easing) && easing.every(isWaapiSupportedEasing));
}
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
const supportedWaapiEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
};
function mapEasingToNativeEasing(easing, duration) {
  if (!easing) {
    return void 0;
  } else if (typeof easing === "function" && supportsLinearEasing()) {
    return generateLinearEasing(easing, duration);
  } else if (isBezierDefinition(easing)) {
    return cubicBezierAsString(easing);
  } else if (Array.isArray(easing)) {
    return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
  } else {
    return supportedWaapiEasing[easing];
  }
}
const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
const backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
const backIn = /* @__PURE__ */ reverseEasing(backOut);
const backInOut = /* @__PURE__ */ mirrorEasing(backIn);
const anticipate = (p) => (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
const circIn = (p) => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circIn);
const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
function isNone(value) {
  if (typeof value === "number") {
    return value === 0;
  } else if (value !== null) {
    return value === "none" || value === "0" || isZeroValueString(value);
  } else {
    return true;
  }
}
const sanitize = (v) => Math.round(v * 1e5) / 1e5;
const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function isNullish(v) {
  return v == null;
}
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
const isColorString = (type, testProp) => (v) => {
  return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
const splitColor = (aName, bName, cName) => (v) => {
  if (typeof v !== "string")
    return v;
  const [a, b, c, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};
const clampRgbUnit = (v) => clamp(0, 255, v);
const rgbUnit = {
  ...number,
  transform: (v) => Math.round(clampRgbUnit(v))
};
const rgba = {
  test: /* @__PURE__ */ isColorString("rgb", "red"),
  parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v) {
  let r = "";
  let g = "";
  let b = "";
  let a = "";
  if (v.length > 5) {
    r = v.substring(1, 3);
    g = v.substring(3, 5);
    b = v.substring(5, 7);
    a = v.substring(7, 9);
  } else {
    r = v.substring(1, 2);
    g = v.substring(2, 3);
    b = v.substring(3, 4);
    a = v.substring(4, 5);
    r += r;
    g += g;
    b += b;
    a += a;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
const hex = {
  test: /* @__PURE__ */ isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
const hsla = {
  test: /* @__PURE__ */ isColorString("hsl", "hue"),
  parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
const color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: (v) => {
    return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  }
};
const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function test(v) {
  var _a2, _b;
  return isNaN(v) && typeof v === "string" && (((_a2 = v.match(floatRegex)) === null || _a2 === void 0 ? void 0 : _a2.length) || 0) + (((_b = v.match(colorRegex)) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0;
}
const NUMBER_TOKEN = "number";
const COLOR_TOKEN = "color";
const VAR_TOKEN = "var";
const VAR_FUNCTION_TOKEN = "var(";
const SPLIT_TOKEN = "${}";
const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
  const originalValue = value.toString();
  const values = [];
  const indexes = {
    color: [],
    number: [],
    var: []
  };
  const types = [];
  let i = 0;
  const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
    if (color.test(parsedValue)) {
      indexes.color.push(i);
      types.push(COLOR_TOKEN);
      values.push(color.parse(parsedValue));
    } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
      indexes.var.push(i);
      types.push(VAR_TOKEN);
      values.push(parsedValue);
    } else {
      indexes.number.push(i);
      types.push(NUMBER_TOKEN);
      values.push(parseFloat(parsedValue));
    }
    ++i;
    return SPLIT_TOKEN;
  });
  const split = tokenised.split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v) {
  return analyseComplexValue(v).values;
}
function createTransformer(source) {
  const { split, types } = analyseComplexValue(source);
  const numSections = split.length;
  return (v) => {
    let output = "";
    for (let i = 0; i < numSections; i++) {
      output += split[i];
      if (v[i] !== void 0) {
        const type = types[i];
        if (type === NUMBER_TOKEN) {
          output += sanitize(v[i]);
        } else if (type === COLOR_TOKEN) {
          output += color.transform(v[i]);
        } else {
          output += v[i];
        }
      }
    }
    return output;
  };
}
const convertNumbersToZero = (v) => typeof v === "number" ? 0 : v;
function getAnimatableNone$1(v) {
  const parsed = parseComplexValue(v);
  const transformer = createTransformer(v);
  return transformer(parsed.map(convertNumbersToZero));
}
const complex = {
  test,
  parse: parseComplexValue,
  createTransformer,
  getAnimatableNone: getAnimatableNone$1
};
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  const [name, value] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
const filter = {
  ...complex,
  getAnimatableNone: (v) => {
    const functions = v.match(functionRegex);
    return functions ? functions.map(applyDefaultFilter).join(" ") : v;
  }
};
const defaultValueTypes = {
  ...numberValueTypes,
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter
};
const getDefaultValueType = (key) => defaultValueTypes[key];
function getAnimatableNone(key, value) {
  let defaultValueType = getDefaultValueType(key);
  if (defaultValueType !== filter)
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
const invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i = 0;
  let animatableTemplate = void 0;
  while (i < unresolvedKeyframes.length && !animatableTemplate) {
    const keyframe = unresolvedKeyframes[i];
    if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
      animatableTemplate = unresolvedKeyframes[i];
    }
    i++;
  }
  if (animatableTemplate && name) {
    for (const noneIndex of noneKeyframeIndexes) {
      unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
    }
  }
}
const isNumOrPxType = (v) => v === number || v === px;
const getPosFromMatrix = (matrix, pos) => parseFloat(matrix.split(", ")[pos]);
const getTranslateFromMatrix = (pos2, pos3) => (_bbox, { transform: transform2 }) => {
  if (transform2 === "none" || !transform2)
    return 0;
  const matrix3d = transform2.match(/^matrix3d\((.+)\)$/u);
  if (matrix3d) {
    return getPosFromMatrix(matrix3d[1], pos3);
  } else {
    const matrix = transform2.match(/^matrix\((.+)\)$/u);
    if (matrix) {
      return getPosFromMatrix(matrix[1], pos2);
    } else {
      return 0;
    }
  }
};
const transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  nonTranslationalTransformKeys.forEach((key) => {
    const value = visualElement.getValue(key);
    if (value !== void 0) {
      removedTransforms.push([key, value.get()]);
      value.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  return removedTransforms;
}
const positionalValues = {
  // Dimensions
  width: ({ x }, { paddingLeft = "0", paddingRight = "0" }) => x.max - x.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
  height: ({ y }, { paddingTop = "0", paddingBottom = "0" }) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
  top: (_bbox, { top }) => parseFloat(top),
  left: (_bbox, { left }) => parseFloat(left),
  bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
  right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
  // Transform
  x: getTranslateFromMatrix(4, 13),
  y: getTranslateFromMatrix(5, 14)
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;
const toResolve = /* @__PURE__ */ new Set();
let isScheduled = false;
let anyNeedsMeasurement = false;
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
    const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
    const transformsToRestore = /* @__PURE__ */ new Map();
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      if (!removedTransforms.length)
        return;
      transformsToRestore.set(element, removedTransforms);
      element.render();
    });
    resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
    elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      if (restore) {
        restore.forEach(([key, value]) => {
          var _a2;
          (_a2 = element.getValue(key)) === null || _a2 === void 0 ? void 0 : _a2.set(value);
        });
      }
    });
    resolversToMeasure.forEach((resolver) => resolver.measureEndState());
    resolversToMeasure.forEach((resolver) => {
      if (resolver.suspendedScrollY !== void 0) {
        window.scrollTo(0, resolver.suspendedScrollY);
      }
    });
  }
  anyNeedsMeasurement = false;
  isScheduled = false;
  toResolve.forEach((resolver) => resolver.complete());
  toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes();
    if (resolver.needsMeasurement) {
      anyNeedsMeasurement = true;
    }
  });
}
function flushKeyframeResolvers() {
  readAllKeyframes();
  measureAllKeyframes();
}
class KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
    this.isComplete = false;
    this.isAsync = false;
    this.needsMeasurement = false;
    this.isScheduled = false;
    this.unresolvedKeyframes = [...unresolvedKeyframes];
    this.onComplete = onComplete;
    this.name = name;
    this.motionValue = motionValue2;
    this.element = element;
    this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.isScheduled = true;
    if (this.isAsync) {
      toResolve.add(this);
      if (!isScheduled) {
        isScheduled = true;
        frame.read(readAllKeyframes);
        frame.resolveKeyframes(measureAllKeyframes);
      }
    } else {
      this.readKeyframes();
      this.complete();
    }
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      if (unresolvedKeyframes[i] === null) {
        if (i === 0) {
          const currentValue = motionValue2 === null || motionValue2 === void 0 ? void 0 : motionValue2.get();
          const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
          if (currentValue !== void 0) {
            unresolvedKeyframes[0] = currentValue;
          } else if (element && name) {
            const valueAsRead = element.readValue(name, finalKeyframe);
            if (valueAsRead !== void 0 && valueAsRead !== null) {
              unresolvedKeyframes[0] = valueAsRead;
            }
          }
          if (unresolvedKeyframes[0] === void 0) {
            unresolvedKeyframes[0] = finalKeyframe;
          }
          if (motionValue2 && currentValue === void 0) {
            motionValue2.set(unresolvedKeyframes[0]);
          }
        } else {
          unresolvedKeyframes[i] = unresolvedKeyframes[i - 1];
        }
      }
    }
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete() {
    this.isComplete = true;
    this.onComplete(this.unresolvedKeyframes, this.finalKeyframe);
    toResolve.delete(this);
  }
  cancel() {
    if (!this.isComplete) {
      this.isScheduled = false;
      toResolve.delete(this);
    }
  }
  resume() {
    if (!this.isComplete)
      this.scheduleResolve();
  }
}
const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
const splitCSSVariableRegex = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 !== null && token1 !== void 0 ? token1 : token2}`, fallback];
}
const maxDepth = 4;
function getVariableValue(current, element, depth = 1) {
  invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`);
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
const testValueType = (v) => (type) => type.test(v);
const auto = {
  test: (v) => v === "auto",
  parse: (v) => v
};
const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
class DOMKeyframesResolver extends KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
    super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
  }
  readKeyframes() {
    const { unresolvedKeyframes, element, name } = this;
    if (!element || !element.current)
      return;
    super.readKeyframes();
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      let keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string") {
        keyframe = keyframe.trim();
        if (isCSSVariableToken(keyframe)) {
          const resolved = getVariableValue(keyframe, element.current);
          if (resolved !== void 0) {
            unresolvedKeyframes[i] = resolved;
          }
          if (i === unresolvedKeyframes.length - 1) {
            this.finalKeyframe = keyframe;
          }
        }
      }
    }
    this.resolveNoneKeyframes();
    if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
      return;
    }
    const [origin, target] = unresolvedKeyframes;
    const originType = findDimensionValueType(origin);
    const targetType = findDimensionValueType(target);
    if (originType === targetType)
      return;
    if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        const value = unresolvedKeyframes[i];
        if (typeof value === "string") {
          unresolvedKeyframes[i] = parseFloat(value);
        }
      }
    } else {
      this.needsMeasurement = true;
    }
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes, name } = this;
    const noneKeyframeIndexes = [];
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      if (isNone(unresolvedKeyframes[i])) {
        noneKeyframeIndexes.push(i);
      }
    }
    if (noneKeyframeIndexes.length) {
      makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
    }
  }
  measureInitialState() {
    const { element, unresolvedKeyframes, name } = this;
    if (!element || !element.current)
      return;
    if (name === "height") {
      this.suspendedScrollY = window.pageYOffset;
    }
    this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    unresolvedKeyframes[0] = this.measuredOrigin;
    const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
    if (measureKeyframe !== void 0) {
      element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
    }
  }
  measureEndState() {
    var _a2;
    const { element, name, unresolvedKeyframes } = this;
    if (!element || !element.current)
      return;
    const value = element.getValue(name);
    value && value.jump(this.measuredOrigin, false);
    const finalKeyframeIndex = unresolvedKeyframes.length - 1;
    const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
    unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    if (finalKeyframe !== null && this.finalKeyframe === void 0) {
      this.finalKeyframe = finalKeyframe;
    }
    if ((_a2 = this.removedTransforms) === null || _a2 === void 0 ? void 0 : _a2.length) {
      this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
        element.getValue(unsetTransformName).set(unsetTransformValue);
      });
    }
    this.resolveNoneKeyframes();
  }
}
const isAnimatable = (value, name) => {
  if (name === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && // It's animatable if we have a string
  (complex.test(value) || value === "0") && // And it contains numbers and/or colors
  !value.startsWith("url(")) {
    return true;
  }
  return false;
};
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return true;
  for (let i = 0; i < keyframes2.length; i++) {
    if (keyframes2[i] !== current)
      return true;
  }
}
function canAnimate(keyframes2, name, type, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null)
    return false;
  if (name === "display" || name === "visibility")
    return true;
  const targetKeyframe = keyframes2[keyframes2.length - 1];
  const isOriginAnimatable = isAnimatable(originKeyframe, name);
  const isTargetAnimatable = isAnimatable(targetKeyframe, name);
  warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". ${originKeyframe} is not an animatable value - to enable this animation set ${originKeyframe} to a value animatable to ${targetKeyframe} via the \`style\` property.`);
  if (!isOriginAnimatable || !isTargetAnimatable) {
    return false;
  }
  return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
}
const isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe) {
  const resolvedKeyframes = keyframes2.filter(isNotNull);
  const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
  return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}
const MAX_RESOLVE_DELAY = 40;
class BaseAnimation {
  constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", ...options }) {
    this.isStopped = false;
    this.hasAttemptedResolve = false;
    this.createdAt = time.now();
    this.options = {
      autoplay,
      delay: delay2,
      type,
      repeat,
      repeatDelay,
      repeatType,
      ...options
    };
    this.updateFinishedPromise();
  }
  /**
   * This method uses the createdAt and resolvedAt to calculate the
   * animation startTime. *Ideally*, we would use the createdAt time as t=0
   * as the following frame would then be the first frame of the animation in
   * progress, which would feel snappier.
   *
   * However, if there's a delay (main thread work) between the creation of
   * the animation and the first commited frame, we prefer to use resolvedAt
   * to avoid a sudden jump into the animation.
   */
  calcStartTime() {
    if (!this.resolvedAt)
      return this.createdAt;
    return this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt;
  }
  /**
   * A getter for resolved data. If keyframes are not yet resolved, accessing
   * this.resolved will synchronously flush all pending keyframe resolvers.
   * This is a deoptimisation, but at its worst still batches read/writes.
   */
  get resolved() {
    if (!this._resolved && !this.hasAttemptedResolve) {
      flushKeyframeResolvers();
    }
    return this._resolved;
  }
  /**
   * A method to be called when the keyframes resolver completes. This method
   * will check if its possible to run the animation and, if not, skip it.
   * Otherwise, it will call initPlayback on the implementing class.
   */
  onKeyframesResolved(keyframes2, finalKeyframe) {
    this.resolvedAt = time.now();
    this.hasAttemptedResolve = true;
    const { name, type, velocity, delay: delay2, onComplete, onUpdate, isGenerator: isGenerator2 } = this.options;
    if (!isGenerator2 && !canAnimate(keyframes2, name, type, velocity)) {
      if (!delay2) {
        onUpdate && onUpdate(getFinalKeyframe(keyframes2, this.options, finalKeyframe));
        onComplete && onComplete();
        this.resolveFinishedPromise();
        return;
      } else {
        this.options.duration = 0;
      }
    }
    const resolvedAnimation = this.initPlayback(keyframes2, finalKeyframe);
    if (resolvedAnimation === false)
      return;
    this._resolved = {
      keyframes: keyframes2,
      finalKeyframe,
      ...resolvedAnimation
    };
    this.onPostResolved();
  }
  onPostResolved() {
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(resolve2, reject) {
    return this.currentFinishedPromise.then(resolve2, reject);
  }
  flatten() {
    this.options.type = "keyframes";
    this.options.ease = "linear";
  }
  updateFinishedPromise() {
    this.currentFinishedPromise = new Promise((resolve2) => {
      this.resolveFinishedPromise = resolve2;
    });
  }
}
const maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state = generator.next(duration);
  while (!state.done && duration < maxGeneratorDuration) {
    duration += timeStep;
    state = generator.next(duration);
  }
  return duration >= maxGeneratorDuration ? Infinity : duration;
}
const mixNumber$1 = (from, to, progress2) => {
  return from + (to - from) * progress2;
};
function hueToRgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
function mixImmediate(a, b) {
  return (p) => p > 0 ? b : a;
}
const mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const expo = v * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
};
const colorTypes = [hex, rgba, hsla];
const getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color2) {
  const type = getColorType(color2);
  warning(Boolean(type), `'${color2}' is not an animatable color. Use the equivalent color code instead.`);
  if (!Boolean(type))
    return false;
  let model = type.parse(color2);
  if (type === hsla) {
    model = hslaToRgba(model);
  }
  return model;
}
const mixColor = (from, to) => {
  const fromRGBA = asRGBA(from);
  const toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA) {
    return mixImmediate(from, to);
  }
  const blended = { ...fromRGBA };
  return (v) => {
    blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
    blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
    blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
    blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
    return rgba.transform(blended);
  };
};
const combineFunctions = (a, b) => (v) => b(a(v));
const pipe = (...transformers) => transformers.reduce(combineFunctions);
const invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
function mixVisibility(origin, target) {
  if (invisibleValues.has(origin)) {
    return (p) => p <= 0 ? origin : target;
  } else {
    return (p) => p >= 1 ? target : origin;
  }
}
function mixNumber(a, b) {
  return (p) => mixNumber$1(a, b, p);
}
function getMixer$1(a) {
  if (typeof a === "number") {
    return mixNumber;
  } else if (typeof a === "string") {
    return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
  } else if (Array.isArray(a)) {
    return mixArray;
  } else if (typeof a === "object") {
    return color.test(a) ? mixColor : mixObject;
  }
  return mixImmediate;
}
function mixArray(a, b) {
  const output = [...a];
  const numValues = output.length;
  const blendValue = a.map((v, i) => getMixer$1(v)(v, b[i]));
  return (p) => {
    for (let i = 0; i < numValues; i++) {
      output[i] = blendValue[i](p);
    }
    return output;
  };
}
function mixObject(a, b) {
  const output = { ...a, ...b };
  const blendValue = {};
  for (const key in output) {
    if (a[key] !== void 0 && b[key] !== void 0) {
      blendValue[key] = getMixer$1(a[key])(a[key], b[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
}
function matchOrder(origin, target) {
  var _a2;
  const orderedOrigin = [];
  const pointers = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < target.values.length; i++) {
    const type = target.types[i];
    const originIndex = origin.indexes[type][pointers[type]];
    const originValue = (_a2 = origin.values[originIndex]) !== null && _a2 !== void 0 ? _a2 : 0;
    orderedOrigin[i] = originValue;
    pointers[type]++;
  }
  return orderedOrigin;
}
const mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyseComplexValue(origin);
  const targetStats = analyseComplexValue(target);
  const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
  if (canInterpolate) {
    if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
      return mixVisibility(origin, target);
    }
    return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
  } else {
    warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`);
    return mixImmediate(origin, target);
  }
};
function mix(from, to, p) {
  if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
    return mixNumber$1(from, to, p);
  }
  const mixer = getMixer$1(from);
  return mixer(from, to);
}
const velocitySampleDuration = 5;
function calcGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - velocitySampleDuration, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
const springDefaults = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
const safeMin = 1e-3;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope;
  let derivative;
  warning(duration <= /* @__PURE__ */ secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less");
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
  duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration));
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a = exponentialDecay - velocity;
      const b = calcAngularFreq(undampedFreq2, dampingRatio);
      const c = Math.exp(-delta);
      return safeMin - a / b * c;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a * b;
    };
    derivative = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (velocity - undampedFreq2) * (duration * duration);
      return a * b;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = /* @__PURE__ */ secondsToMilliseconds(duration);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys2) {
  return keys2.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: false,
    ...options
  };
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    if (options.visualDuration) {
      const visualDuration = options.visualDuration;
      const root = 2 * Math.PI / (visualDuration * 1.2);
      const stiffness = root * root;
      const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring(options);
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      };
      springOptions.isResolvedFromDuration = true;
    }
  }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options = typeof optionsOrVisualDuration !== "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options;
  const origin = options.keyframes[0];
  const target = options.keyframes[options.keyframes.length - 1];
  const state = { done: false, value: origin };
  const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options,
    velocity: -/* @__PURE__ */ millisecondsToSeconds(options.velocity || 0)
  });
  const initialVelocity = velocity || 0;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const initialDelta = target - origin;
  const undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass));
  const isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
  restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  if (dampingRatio < 1) {
    const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
    };
  } else if (dampingRatio === 1) {
    resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
  } else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration ? duration || null : null,
    next: (t) => {
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        let currentVelocity = 0;
        if (dampingRatio < 1) {
          currentVelocity = t === 0 ? /* @__PURE__ */ secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t, current);
        }
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
      } else {
        state.done = t >= duration;
      }
      state.value = state.done ? target : current;
      return state;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
      const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    }
  };
  return generator;
}
function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
  const origin = keyframes2[0];
  const state = {
    done: false,
    value: origin
  };
  const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
  const nearestBoundary = (v) => {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  };
  let amplitude = power * velocity;
  const ideal = origin + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - origin;
  const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
  const calcLatest = (t) => target + calcDelta(t);
  const applyFriction = (t) => {
    const delta = calcDelta(t);
    const latest = calcLatest(t);
    state.done = Math.abs(delta) <= restDelta;
    state.value = state.done ? target : latest;
  };
  let timeReachedBoundary;
  let spring$1;
  const checkCatchBoundary = (t) => {
    if (!isOutOfBounds(state.value))
      return;
    timeReachedBoundary = t;
    spring$1 = spring({
      keyframes: [state.value, nearestBoundary(state.value)],
      velocity: calcGeneratorVelocity(calcLatest, t, state.value),
      // TODO: This should be passing * 1000
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    });
  };
  checkCatchBoundary(0);
  return {
    calculatedDuration: null,
    next: (t) => {
      let hasUpdatedFrame = false;
      if (!spring$1 && timeReachedBoundary === void 0) {
        hasUpdatedFrame = true;
        applyFriction(t);
        checkCatchBoundary(t);
      }
      if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
        return spring$1.next(t - timeReachedBoundary);
      } else {
        !hasUpdatedFrame && applyFriction(t);
        return state;
      }
    }
  };
}
const easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
const easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
const easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);
const isEasingArray = (ease2) => {
  return Array.isArray(ease2) && typeof ease2[0] !== "number";
};
const easingLookup = {
  linear: noop,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate
};
const easingDefinitionToFunction = (definition) => {
  if (isBezierDefinition(definition)) {
    invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`);
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (typeof definition === "string") {
    invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`);
    return easingLookup[definition];
  }
  return definition;
};
function createMixers(output, ease2, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || mix;
  const numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease2) {
      const easingFunction = Array.isArray(ease2) ? ease2[i] || noop : ease2;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length, "Both input and output ranges must be the same length");
  if (inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  if (input[0] > input[inputLength - 1]) {
    input = [...input].reverse();
    output = [...output].reverse();
  }
  const mixers = createMixers(output, ease2, mixer);
  const numMixers = mixers.length;
  const interpolator = (v) => {
    if (isZeroDeltaRange && v < input[0])
      return output[0];
    let i = 0;
    if (numMixers > 1) {
      for (; i < input.length - 2; i++) {
        if (v < input[i + 1])
          break;
      }
    }
    const progressInRange = /* @__PURE__ */ progress(input[i], input[i + 1], v);
    return mixers[i](progressInRange);
  };
  return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i = 1; i <= remaining; i++) {
    const offsetProgress = /* @__PURE__ */ progress(0, remaining, i);
    offset.push(mixNumber$1(min, 1, offsetProgress));
  }
}
function defaultOffset$1(arr) {
  const offset = [0];
  fillOffset(offset, arr.length - 1);
  return offset;
}
function convertOffsetToTimes(offset, duration) {
  return offset.map((o) => o * duration);
}
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
  const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
  const state = {
    done: false,
    value: keyframeValues[0]
  };
  const absoluteTimes = convertOffsetToTimes(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    times && times.length === keyframeValues.length ? times : defaultOffset$1(keyframeValues),
    duration
  );
  const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t) => {
      state.value = mapTimeToKeyframe(t);
      state.done = t >= duration;
      return state;
    }
  };
}
const frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: () => frame.update(passTimestamp, true),
    stop: () => cancelFrame(passTimestamp),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => frameData.isProcessing ? frameData.timestamp : time.now()
  };
};
const generators = {
  decay: inertia,
  inertia,
  tween: keyframes,
  keyframes,
  spring
};
const percentToProgress = (percent2) => percent2 / 100;
class MainThreadAnimation extends BaseAnimation {
  constructor(options) {
    super(options);
    this.holdTime = null;
    this.cancelTime = null;
    this.currentTime = 0;
    this.playbackSpeed = 1;
    this.pendingPlayState = "running";
    this.startTime = null;
    this.state = "idle";
    this.stop = () => {
      this.resolver.cancel();
      this.isStopped = true;
      if (this.state === "idle")
        return;
      this.teardown();
      const { onStop } = this.options;
      onStop && onStop();
    };
    const { name, motionValue: motionValue2, element, keyframes: keyframes2 } = this.options;
    const KeyframeResolver$1 = (element === null || element === void 0 ? void 0 : element.KeyframeResolver) || KeyframeResolver;
    const onResolved = (resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe);
    this.resolver = new KeyframeResolver$1(keyframes2, onResolved, name, motionValue2, element);
    this.resolver.scheduleResolve();
  }
  flatten() {
    super.flatten();
    if (this._resolved) {
      Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
    }
  }
  initPlayback(keyframes$1) {
    const { type = "keyframes", repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = this.options;
    const generatorFactory = isGenerator(type) ? type : generators[type] || keyframes;
    let mapPercentToKeyframes;
    let mirroredGenerator;
    if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
      if (process.env.NODE_ENV !== "production") {
        invariant(keyframes$1.length === 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$1}`);
      }
      mapPercentToKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
      keyframes$1 = [0, 100];
    }
    const generator = generatorFactory({ ...this.options, keyframes: keyframes$1 });
    if (repeatType === "mirror") {
      mirroredGenerator = generatorFactory({
        ...this.options,
        keyframes: [...keyframes$1].reverse(),
        velocity: -velocity
      });
    }
    if (generator.calculatedDuration === null) {
      generator.calculatedDuration = calcGeneratorDuration(generator);
    }
    const { calculatedDuration } = generator;
    const resolvedDuration = calculatedDuration + repeatDelay;
    const totalDuration = resolvedDuration * (repeat + 1) - repeatDelay;
    return {
      generator,
      mirroredGenerator,
      mapPercentToKeyframes,
      calculatedDuration,
      resolvedDuration,
      totalDuration
    };
  }
  onPostResolved() {
    const { autoplay = true } = this.options;
    this.play();
    if (this.pendingPlayState === "paused" || !autoplay) {
      this.pause();
    } else {
      this.state = this.pendingPlayState;
    }
  }
  tick(timestamp, sample = false) {
    const { resolved } = this;
    if (!resolved) {
      const { keyframes: keyframes3 } = this.options;
      return { done: true, value: keyframes3[keyframes3.length - 1] };
    }
    const { finalKeyframe, generator, mirroredGenerator, mapPercentToKeyframes, keyframes: keyframes2, calculatedDuration, totalDuration, resolvedDuration } = resolved;
    if (this.startTime === null)
      return generator.next(0);
    const { delay: delay2, repeat, repeatType, repeatDelay, onUpdate } = this.options;
    if (this.speed > 0) {
      this.startTime = Math.min(this.startTime, timestamp);
    } else if (this.speed < 0) {
      this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
    }
    if (sample) {
      this.currentTime = timestamp;
    } else if (this.holdTime !== null) {
      this.currentTime = this.holdTime;
    } else {
      this.currentTime = Math.round(timestamp - this.startTime) * this.speed;
    }
    const timeWithoutDelay = this.currentTime - delay2 * (this.speed >= 0 ? 1 : -1);
    const isInDelayPhase = this.speed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
    this.currentTime = Math.max(timeWithoutDelay, 0);
    if (this.state === "finished" && this.holdTime === null) {
      this.currentTime = totalDuration;
    }
    let elapsed = this.currentTime;
    let frameGenerator = generator;
    if (repeat) {
      const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
      let currentIteration = Math.floor(progress2);
      let iterationProgress = progress2 % 1;
      if (!iterationProgress && progress2 >= 1) {
        iterationProgress = 1;
      }
      iterationProgress === 1 && currentIteration--;
      currentIteration = Math.min(currentIteration, repeat + 1);
      const isOddIteration = Boolean(currentIteration % 2);
      if (isOddIteration) {
        if (repeatType === "reverse") {
          iterationProgress = 1 - iterationProgress;
          if (repeatDelay) {
            iterationProgress -= repeatDelay / resolvedDuration;
          }
        } else if (repeatType === "mirror") {
          frameGenerator = mirroredGenerator;
        }
      }
      elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
    }
    const state = isInDelayPhase ? { done: false, value: keyframes2[0] } : frameGenerator.next(elapsed);
    if (mapPercentToKeyframes) {
      state.value = mapPercentToKeyframes(state.value);
    }
    let { done } = state;
    if (!isInDelayPhase && calculatedDuration !== null) {
      done = this.speed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
    }
    const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
    if (isAnimationFinished && finalKeyframe !== void 0) {
      state.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe);
    }
    if (onUpdate) {
      onUpdate(state.value);
    }
    if (isAnimationFinished) {
      this.finish();
    }
    return state;
  }
  get duration() {
    const { resolved } = this;
    return resolved ? /* @__PURE__ */ millisecondsToSeconds(resolved.calculatedDuration) : 0;
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
  }
  set time(newTime) {
    newTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    this.currentTime = newTime;
    if (this.holdTime !== null || this.speed === 0) {
      this.holdTime = newTime;
    } else if (this.driver) {
      this.startTime = this.driver.now() - newTime / this.speed;
    }
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(newSpeed) {
    const hasChanged = this.playbackSpeed !== newSpeed;
    this.playbackSpeed = newSpeed;
    if (hasChanged) {
      this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
    }
  }
  play() {
    if (!this.resolver.isScheduled) {
      this.resolver.resume();
    }
    if (!this._resolved) {
      this.pendingPlayState = "running";
      return;
    }
    if (this.isStopped)
      return;
    const { driver = frameloopDriver, onPlay, startTime } = this.options;
    if (!this.driver) {
      this.driver = driver((timestamp) => this.tick(timestamp));
    }
    onPlay && onPlay();
    const now2 = this.driver.now();
    if (this.holdTime !== null) {
      this.startTime = now2 - this.holdTime;
    } else if (!this.startTime) {
      this.startTime = startTime !== null && startTime !== void 0 ? startTime : this.calcStartTime();
    } else if (this.state === "finished") {
      this.startTime = now2;
    }
    if (this.state === "finished") {
      this.updateFinishedPromise();
    }
    this.cancelTime = this.startTime;
    this.holdTime = null;
    this.state = "running";
    this.driver.start();
  }
  pause() {
    var _a2;
    if (!this._resolved) {
      this.pendingPlayState = "paused";
      return;
    }
    this.state = "paused";
    this.holdTime = (_a2 = this.currentTime) !== null && _a2 !== void 0 ? _a2 : 0;
  }
  complete() {
    if (this.state !== "running") {
      this.play();
    }
    this.pendingPlayState = this.state = "finished";
    this.holdTime = null;
  }
  finish() {
    this.teardown();
    this.state = "finished";
    const { onComplete } = this.options;
    onComplete && onComplete();
  }
  cancel() {
    if (this.cancelTime !== null) {
      this.tick(this.cancelTime);
    }
    this.teardown();
    this.updateFinishedPromise();
  }
  teardown() {
    this.state = "idle";
    this.stopDriver();
    this.resolveFinishedPromise();
    this.updateFinishedPromise();
    this.startTime = this.cancelTime = null;
    this.resolver.cancel();
  }
  stopDriver() {
    if (!this.driver)
      return;
    this.driver.stop();
    this.driver = void 0;
  }
  sample(time2) {
    this.startTime = 0;
    return this.tick(time2, true);
  }
}
const acceleratedValues = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeInOut", times } = {}) {
  const keyframeOptions = { [valueName]: keyframes2 };
  if (times)
    keyframeOptions.offset = times;
  const easing = mapEasingToNativeEasing(ease2, duration);
  if (Array.isArray(easing))
    keyframeOptions.easing = easing;
  return element.animate(keyframeOptions, {
    delay: delay2,
    duration,
    easing: !Array.isArray(easing) ? easing : "linear",
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  });
}
const supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
const sampleDelta = 10;
const maxDuration = 2e4;
function requiresPregeneratedKeyframes(options) {
  return isGenerator(options.type) || options.type === "spring" || !isWaapiSupportedEasing(options.ease);
}
function pregenerateKeyframes(keyframes2, options) {
  const sampleAnimation = new MainThreadAnimation({
    ...options,
    keyframes: keyframes2,
    repeat: 0,
    delay: 0,
    isGenerator: true
  });
  let state = { done: false, value: keyframes2[0] };
  const pregeneratedKeyframes = [];
  let t = 0;
  while (!state.done && t < maxDuration) {
    state = sampleAnimation.sample(t);
    pregeneratedKeyframes.push(state.value);
    t += sampleDelta;
  }
  return {
    times: void 0,
    keyframes: pregeneratedKeyframes,
    duration: t - sampleDelta,
    ease: "linear"
  };
}
const unsupportedEasingFunctions = {
  anticipate,
  backInOut,
  circInOut
};
function isUnsupportedEase(key) {
  return key in unsupportedEasingFunctions;
}
class AcceleratedAnimation extends BaseAnimation {
  constructor(options) {
    super(options);
    const { name, motionValue: motionValue2, element, keyframes: keyframes2 } = this.options;
    this.resolver = new DOMKeyframesResolver(keyframes2, (resolvedKeyframes, finalKeyframe) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe), name, motionValue2, element);
    this.resolver.scheduleResolve();
  }
  initPlayback(keyframes2, finalKeyframe) {
    let { duration = 300, times, ease: ease2, type, motionValue: motionValue2, name, startTime } = this.options;
    if (!motionValue2.owner || !motionValue2.owner.current) {
      return false;
    }
    if (typeof ease2 === "string" && supportsLinearEasing() && isUnsupportedEase(ease2)) {
      ease2 = unsupportedEasingFunctions[ease2];
    }
    if (requiresPregeneratedKeyframes(this.options)) {
      const { onComplete, onUpdate, motionValue: motionValue3, element, ...options } = this.options;
      const pregeneratedAnimation = pregenerateKeyframes(keyframes2, options);
      keyframes2 = pregeneratedAnimation.keyframes;
      if (keyframes2.length === 1) {
        keyframes2[1] = keyframes2[0];
      }
      duration = pregeneratedAnimation.duration;
      times = pregeneratedAnimation.times;
      ease2 = pregeneratedAnimation.ease;
      type = "keyframes";
    }
    const animation = startWaapiAnimation(motionValue2.owner.current, name, keyframes2, { ...this.options, duration, times, ease: ease2 });
    animation.startTime = startTime !== null && startTime !== void 0 ? startTime : this.calcStartTime();
    if (this.pendingTimeline) {
      attachTimeline(animation, this.pendingTimeline);
      this.pendingTimeline = void 0;
    } else {
      animation.onfinish = () => {
        const { onComplete } = this.options;
        motionValue2.set(getFinalKeyframe(keyframes2, this.options, finalKeyframe));
        onComplete && onComplete();
        this.cancel();
        this.resolveFinishedPromise();
      };
    }
    return {
      animation,
      duration,
      times,
      type,
      ease: ease2,
      keyframes: keyframes2
    };
  }
  get duration() {
    const { resolved } = this;
    if (!resolved)
      return 0;
    const { duration } = resolved;
    return /* @__PURE__ */ millisecondsToSeconds(duration);
  }
  get time() {
    const { resolved } = this;
    if (!resolved)
      return 0;
    const { animation } = resolved;
    return /* @__PURE__ */ millisecondsToSeconds(animation.currentTime || 0);
  }
  set time(newTime) {
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
  }
  get speed() {
    const { resolved } = this;
    if (!resolved)
      return 1;
    const { animation } = resolved;
    return animation.playbackRate;
  }
  set speed(newSpeed) {
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    animation.playbackRate = newSpeed;
  }
  get state() {
    const { resolved } = this;
    if (!resolved)
      return "idle";
    const { animation } = resolved;
    return animation.playState;
  }
  get startTime() {
    const { resolved } = this;
    if (!resolved)
      return null;
    const { animation } = resolved;
    return animation.startTime;
  }
  /**
   * Replace the default DocumentTimeline with another AnimationTimeline.
   * Currently used for scroll animations.
   */
  attachTimeline(timeline) {
    if (!this._resolved) {
      this.pendingTimeline = timeline;
    } else {
      const { resolved } = this;
      if (!resolved)
        return noop;
      const { animation } = resolved;
      attachTimeline(animation, timeline);
    }
    return noop;
  }
  play() {
    if (this.isStopped)
      return;
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    if (animation.playState === "finished") {
      this.updateFinishedPromise();
    }
    animation.play();
  }
  pause() {
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation } = resolved;
    animation.pause();
  }
  stop() {
    this.resolver.cancel();
    this.isStopped = true;
    if (this.state === "idle")
      return;
    this.resolveFinishedPromise();
    this.updateFinishedPromise();
    const { resolved } = this;
    if (!resolved)
      return;
    const { animation, keyframes: keyframes2, duration, type, ease: ease2, times } = resolved;
    if (animation.playState === "idle" || animation.playState === "finished") {
      return;
    }
    if (this.time) {
      const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
      const sampleAnimation = new MainThreadAnimation({
        ...options,
        keyframes: keyframes2,
        duration,
        type,
        ease: ease2,
        times,
        isGenerator: true
      });
      const sampleTime = /* @__PURE__ */ secondsToMilliseconds(this.time);
      motionValue2.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
    }
    const { onStop } = this.options;
    onStop && onStop();
    this.cancel();
  }
  complete() {
    const { resolved } = this;
    if (!resolved)
      return;
    resolved.animation.finish();
  }
  cancel() {
    const { resolved } = this;
    if (!resolved)
      return;
    resolved.animation.cancel();
  }
  static supports(options) {
    const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type } = options;
    if (!motionValue2 || !motionValue2.owner || !(motionValue2.owner.current instanceof HTMLElement)) {
      return false;
    }
    const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
    return supportsWaapi() && name && acceleratedValues.has(name) && /**
     * If we're outputting values to onUpdate then we can't use WAAPI as there's
     * no way to read the value from WAAPI every frame.
     */
    !onUpdate && !transformTemplate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
  }
}
const underDampedSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
};
const criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
});
const keyframesTransition = {
  type: "keyframes",
  duration: 0.8
};
const ease = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
};
const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
  if (keyframes2.length > 2) {
    return keyframesTransition;
  } else if (transformProps.has(valueKey)) {
    return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
  }
  return ease;
};
function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
  return !!Object.keys(transition).length;
}
const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {};
  const delay2 = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay2);
  let options = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v) => {
      value.set(v);
      valueTransition.onUpdate && valueTransition.onUpdate(v);
    },
    onComplete: () => {
      onComplete();
      valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value,
    element: isHandoff ? void 0 : element
  };
  if (!isTransitionDefined(valueTransition)) {
    options = {
      ...options,
      ...getDefaultTransition(name, options)
    };
  }
  if (options.duration) {
    options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration);
  }
  if (options.repeatDelay) {
    options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay);
  }
  if (options.from !== void 0) {
    options.keyframes[0] = options.from;
  }
  let shouldSkip = false;
  if (options.type === false || options.duration === 0 && !options.repeatDelay) {
    options.duration = 0;
    if (options.delay === 0) {
      shouldSkip = true;
    }
  }
  if (shouldSkip && !isHandoff && value.get() !== void 0) {
    const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
    if (finalKeyframe !== void 0) {
      frame.update(() => {
        options.onUpdate(finalKeyframe);
        options.onComplete();
      });
      return new GroupPlaybackControls([]);
    }
  }
  if (!isHandoff && AcceleratedAnimation.supports(options)) {
    return new AcceleratedAnimation(options);
  } else {
    return new MainThreadAnimation(options);
  }
};
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
  const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
  var _a2;
  let { transition = visualElement.getDefaultTransition(), transitionEnd, ...target } = targetAndTransition;
  if (transitionOverride)
    transition = transitionOverride;
  const animations2 = [];
  const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
  for (const key in target) {
    const value = visualElement.getValue(key, (_a2 = visualElement.latestValues[key]) !== null && _a2 !== void 0 ? _a2 : null);
    const valueTarget = target[key];
    if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    const valueTransition = {
      delay: delay2,
      ...getValueTransition(transition || {}, key)
    };
    let isHandoff = false;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key, frame);
        if (startTime !== null) {
          valueTransition.startTime = startTime;
          isHandoff = true;
        }
      }
    }
    addValueToWillChange(visualElement, key);
    value.start(animateMotionValue(key, value, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
    const animation = value.animation;
    if (animation) {
      animations2.push(animation);
    }
  }
  if (transitionEnd) {
    Promise.all(animations2).then(() => {
      frame.update(() => {
        transitionEnd && setTarget(visualElement, transitionEnd);
      });
    });
  }
  return animations2;
}
function animateVariant(visualElement, variant, options = {}) {
  var _a2;
  const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? (_a2 = visualElement.presenceContext) === null || _a2 === void 0 ? void 0 : _a2.custom : void 0);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  if (options.transitionOverride) {
    transition = options.transitionOverride;
  }
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
  const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, delayChildren + forwardDelay, staggerChildren, staggerDirection, options);
  } : () => Promise.resolve();
  const { when } = transition;
  if (when) {
    const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last());
  } else {
    return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
  }
}
function animateChildren(visualElement, variant, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
  const animations2 = [];
  const maxStaggerDuration = (visualElement.variantChildren.size - 1) * staggerChildren;
  const generateStaggerDuration = staggerDirection === 1 ? (i = 0) => i * staggerChildren : (i = 0) => maxStaggerDuration - i * staggerChildren;
  Array.from(visualElement.variantChildren).sort(sortByTreeOrder).forEach((child, i) => {
    child.notify("AnimationStart", variant);
    animations2.push(animateVariant(child, variant, {
      ...options,
      delay: delayChildren + generateStaggerDuration(i)
    }).then(() => child.notify("AnimationComplete", variant)));
  });
  return Promise.all(animations2);
}
function sortByTreeOrder(a, b) {
  return a.sortNodePosition(b);
}
function animateVisualElement(visualElement, definition, options = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation;
  if (Array.isArray(definition)) {
    const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
    animation = Promise.all(animations2);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement, definition, options);
  } else {
    const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
    animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
  }
  return animation.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}
const numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
  if (!visualElement)
    return void 0;
  if (!visualElement.isControllingVariants) {
    const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    if (visualElement.props.initial !== void 0) {
      context2.initial = visualElement.props.initial;
    }
    return context2;
  }
  const context = {};
  for (let i = 0; i < numVariantProps; i++) {
    const name = variantProps[i];
    const prop = visualElement.props[name];
    if (isVariantLabel(prop) || prop === false) {
      context[name] = prop;
    }
  }
  return context;
}
const reversePriorityOrder = [...variantPriorityOrder].reverse();
const numAnimationTypes = variantPriorityOrder.length;
function animateList(visualElement) {
  return (animations2) => Promise.all(animations2.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
}
function createAnimationState(visualElement) {
  let animate = animateList(visualElement);
  let state = createState();
  let isInitialRender = true;
  const buildResolvedTypeValues = (type) => (acc, definition) => {
    var _a2;
    const resolved = resolveVariant(visualElement, definition, type === "exit" ? (_a2 = visualElement.presenceContext) === null || _a2 === void 0 ? void 0 : _a2.custom : void 0);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement;
    const context = getVariantContext(visualElement.parent) || {};
    const animations2 = [];
    const removedKeys = /* @__PURE__ */ new Set();
    let encounteredKeys = {};
    let removedVariantIndex = Infinity;
    for (let i = 0; i < numAnimationTypes; i++) {
      const type = reversePriorityOrder[i];
      const typeState = state[type];
      const prop = props[type] !== void 0 ? props[type] : context[type];
      const propIsVariant = isVariantLabel(prop);
      const activeDelta = type === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i;
      let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
      if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = { ...encounteredKeys };
      if (
        // If it isn't active and hasn't *just* been set as inactive
        !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
        !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
        isAnimationControls(prop) || typeof prop === "boolean"
      ) {
        continue;
      }
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
      type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
      i > removedVariantIndex && propIsVariant;
      let handledRemovedValues = false;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
      if (activeDelta === false)
        resolvedValues = {};
      const { prevResolvedValues = {} } = typeState;
      const allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      };
      const markToAnimate = (key) => {
        shouldAnimateType = true;
        if (removedKeys.has(key)) {
          handledRemovedValues = true;
          removedKeys.delete(key);
        }
        typeState.needsAnimating[key] = true;
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = false;
      };
      for (const key in allKeys) {
        const next = resolvedValues[key];
        const prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        let valueHasChanged = false;
        if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
          valueHasChanged = !shallowCompare(next, prev);
        } else {
          valueHasChanged = next !== prev;
        }
        if (valueHasChanged) {
          if (next !== void 0 && next !== null) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next !== void 0 && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = { ...encounteredKeys, ...resolvedValues };
      }
      if (isInitialRender && visualElement.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      const willAnimateViaParent = isInherited && variantDidChange;
      const needsAnimating = !willAnimateViaParent || handledRemovedValues;
      if (shouldAnimateType && needsAnimating) {
        animations2.push(...definitionList.map((animation) => ({
          animation,
          options: { type }
        })));
      }
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      removedKeys.forEach((key) => {
        const fallbackTarget = visualElement.getBaseTarget(key);
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = true;
        fallbackAnimation[key] = fallbackTarget !== null && fallbackTarget !== void 0 ? fallbackTarget : null;
      });
      animations2.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = Boolean(animations2.length);
    if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    return shouldAnimate ? animate(animations2) : Promise.resolve();
  }
  function setActive(type, isActive) {
    var _a2;
    if (state[type].isActive === isActive)
      return Promise.resolve();
    (_a2 = visualElement.variantChildren) === null || _a2 === void 0 ? void 0 : _a2.forEach((child) => {
      var _a3;
      return (_a3 = child.animationState) === null || _a3 === void 0 ? void 0 : _a3.setActive(type, isActive);
    });
    state[type].isActive = isActive;
    const animations2 = animateChanges(type);
    for (const key in state) {
      state[key].protectedKeys = {};
    }
    return animations2;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state,
    reset: () => {
      state = createState();
      isInitialRender = true;
    }
  };
}
function checkVariantsDidChange(prev, next) {
  if (typeof next === "string") {
    return next !== prev;
  } else if (Array.isArray(next)) {
    return !shallowCompare(next, prev);
  }
  return false;
}
function createTypeState(isActive = false) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(true),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}
class Feature {
  constructor(node) {
    this.isMounted = false;
    this.node = node;
  }
  update() {
  }
}
class AnimationFeature extends Feature {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(node) {
    super(node);
    node.animationState || (node.animationState = createAnimationState(node));
  }
  updateAnimationControlsSubscription() {
    const { animate } = this.node.getProps();
    if (isAnimationControls(animate)) {
      this.unmountControls = animate.subscribe(this.node);
    }
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate } = this.node.getProps();
    const { animate: prevAnimate } = this.node.prevProps || {};
    if (animate !== prevAnimate) {
      this.updateAnimationControlsSubscription();
    }
  }
  unmount() {
    var _a2;
    this.node.animationState.reset();
    (_a2 = this.unmountControls) === null || _a2 === void 0 ? void 0 : _a2.call(this);
  }
}
let id$1 = 0;
class ExitAnimationFeature extends Feature {
  constructor() {
    super(...arguments);
    this.id = id$1++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent, onExitComplete } = this.node.presenceContext;
    const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || isPresent === prevIsPresent) {
      return;
    }
    const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
    if (onExitComplete && !isPresent) {
      exitAnimation.then(() => onExitComplete(this.id));
    }
  }
  mount() {
    const { register } = this.node.presenceContext || {};
    if (register) {
      this.unmount = register(this.id);
    }
  }
  unmount() {
  }
}
const animations = {
  animation: {
    Feature: AnimationFeature
  },
  exit: {
    Feature: ExitAnimationFeature
  }
};
const isDragging = {
  x: false,
  y: false
};
function isDragActive() {
  return isDragging.x || isDragging.y;
}
function setDragLock(axis) {
  if (axis === "x" || axis === "y") {
    if (isDragging[axis]) {
      return null;
    } else {
      isDragging[axis] = true;
      return () => {
        isDragging[axis] = false;
      };
    }
  } else {
    if (isDragging.x || isDragging.y) {
      return null;
    } else {
      isDragging.x = isDragging.y = true;
      return () => {
        isDragging.x = isDragging.y = false;
      };
    }
  }
}
const isPrimaryPointer = (event) => {
  if (event.pointerType === "mouse") {
    return typeof event.button !== "number" || event.button <= 0;
  } else {
    return event.isPrimary !== false;
  }
};
function addDomEvent(target, eventName, handler, options = { passive: true }) {
  target.addEventListener(eventName, handler, options);
  return () => target.removeEventListener(eventName, handler);
}
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
const addPointerInfo = (handler) => {
  return (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
};
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
const distance = (a, b) => Math.abs(a - b);
function distance2D(a, b) {
  const xDelta = distance(a.x, b.x);
  const yDelta = distance(a.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
class PanSession {
  constructor(event, handlers, { transformPagePoint, contextWindow, dragSnapToOrigin = false } = {}) {
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.handlers = {};
    this.contextWindow = window;
    this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= 3;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point3 } = info2;
      const { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point3, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart && onStart(this.lastMoveEvent, info2);
        this.startEvent = this.lastMoveEvent;
      }
      onMove && onMove(this.lastMoveEvent, info2);
    };
    this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2;
      this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
      frame.update(this.updatePoint, true);
    };
    this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin)
        resumeAnimation && resumeAnimation();
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      if (this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (!isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event);
    const initialInfo = transformPoint(info, this.transformPagePoint);
    const { point: point2 } = initialInfo;
    const { timestamp } = frameData;
    this.history = [{ ...point2, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners();
    cancelFrame(this.updatePoint);
  }
}
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo({ point: point2 }, history) {
  return {
    point: point2,
    delta: subtractPoint(point2, lastDevicePoint(history)),
    offset: subtractPoint(point2, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  const time2 = /* @__PURE__ */ millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
const SCALE_PRECISION = 1e-4;
const SCALE_MIN = 1 - SCALE_PRECISION;
const SCALE_MAX = 1 + SCALE_PRECISION;
const TRANSLATE_PRECISION = 0.01;
const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
  return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = 0.5) {
  delta.origin = origin;
  delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
  delta.scale = calcLength(target) / calcLength(source);
  delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
  if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
    delta.scale = 1;
  }
  if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
    delta.translate = 0;
  }
}
function calcBoxDelta(delta, source, target, origin) {
  calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
  calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent) {
  target.min = parent.min + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent) {
  calcRelativeAxis(target.x, relative.x, parent.x);
  calcRelativeAxis(target.y, relative.y, parent.y);
}
function calcRelativeAxisPosition(target, layout2, parent) {
  target.min = layout2.min - parent.min;
  target.max = target.min + calcLength(layout2);
}
function calcRelativePosition(target, layout2, parent) {
  calcRelativeAxisPosition(target.x, layout2.x, parent.x);
  calcRelativeAxisPosition(target.y, layout2.y, parent.y);
}
function applyConstraints(point2, { min, max }, elastic) {
  if (min !== void 0 && point2 < min) {
    point2 = elastic ? mixNumber$1(min, point2, elastic.min) : Math.max(point2, min);
  } else if (max !== void 0 && point2 > max) {
    point2 = elastic ? mixNumber$1(max, point2, elastic.max) : Math.min(point2, max);
  }
  return point2;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== void 0 ? axis.min + min : void 0,
    max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min = constraintsAxis.min - layoutAxis.min;
  let max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    [min, max] = [max, min];
  }
  return { min, max };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin(source, target) {
  let origin = 0.5;
  const sourceLength = calcLength(source);
  const targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = /* @__PURE__ */ progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = /* @__PURE__ */ progress(source.min, source.max - targetLength, target.min);
  }
  return clamp(0, 1, origin);
}
function rebaseAxisConstraints(layout2, constraints) {
  const relativeConstraints = {};
  if (constraints.min !== void 0) {
    relativeConstraints.min = constraints.min - layout2.min;
  }
  if (constraints.max !== void 0) {
    relativeConstraints.max = constraints.max - layout2.min;
  }
  return relativeConstraints;
}
const defaultElastic = 0.35;
function resolveDragElastic(dragElastic = defaultElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
const createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
});
const createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
});
const createAxis = () => ({ min: 0, max: 0 });
const createBox = () => ({
  x: createAxis(),
  y: createAxis()
});
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x, y }) {
  return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
function transformBoxPoints(point2, transformPoint2) {
  if (!transformPoint2)
    return point2;
  const topLeft = transformPoint2({ x: point2.left, y: point2.top });
  const bottomRight = transformPoint2({ x: point2.right, y: point2.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
function isIdentityScale(scale2) {
  return scale2 === void 0 || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX, scaleY }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX) || !isIdentityScale(scaleY);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
  return value && value !== "0%";
}
function scalePoint(point2, scale2, originPoint) {
  const distanceFromOrigin = point2 - originPoint;
  const scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point2, translate, scale2, originPoint, boxScale) {
  if (boxScale !== void 0) {
    point2 = scalePoint(point2, boxScale, originPoint);
  }
  return scalePoint(point2, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x, y }) {
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
  applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
const TREE_SCALE_SNAP_MIN = 0.999999999999;
const TREE_SCALE_SNAP_MAX = 1.0000000000001;
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node;
  let delta;
  for (let i = 0; i < treeLength; i++) {
    node = treePath[i];
    delta = node.projectionDelta;
    const { visualElement } = node.options;
    if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
      continue;
    }
    if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
      transformBox(box, {
        x: -node.scroll.offset.x,
        y: -node.scroll.offset.y
      });
    }
    if (delta) {
      treeScale.x *= delta.x.scale;
      treeScale.y *= delta.y.scale;
      applyBoxDelta(box, delta);
    }
    if (isSharedTransition && hasTransform(node.latestValues)) {
      transformBox(box, node.latestValues);
    }
  }
  if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
    treeScale.x = 1;
  }
  if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
    treeScale.y = 1;
  }
}
function translateAxis(axis, distance2) {
  axis.min = axis.min + distance2;
  axis.max = axis.max + distance2;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function transformBox(box, transform2) {
  transformAxis(box.x, transform2.x, transform2.scaleX, transform2.scale, transform2.originX);
  transformAxis(box.y, transform2.y, transform2.scaleY, transform2.scale, transform2.originY);
}
function measureViewportBox(instance, transformPoint2) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
}
function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint);
  const { scroll: scroll2 } = rootProjectionNode2;
  if (scroll2) {
    translateAxis(viewportBox.x, scroll2.offset.x);
    translateAxis(viewportBox.y, scroll2.offset.y);
  }
  return viewportBox;
}
const getContextWindow = ({ current }) => {
  return current ? current.ownerDocument.defaultView : null;
};
const elementDragControls = /* @__PURE__ */ new WeakMap();
class VisualElementDragControls {
  constructor(visualElement) {
    this.openDragLock = null;
    this.isDragging = false;
    this.currentDirection = null;
    this.originPoint = { x: 0, y: 0 };
    this.constraints = false;
    this.hasMutatedConstraints = false;
    this.elastic = createBox();
    this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = false } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === false)
      return;
    const onSessionStart = (event) => {
      const { dragSnapToOrigin: dragSnapToOrigin2 } = this.getProps();
      dragSnapToOrigin2 ? this.pauseAnimation() : this.stopAnimation();
      if (snapToCursor) {
        this.snapToCursor(extractEventInfo(event).point);
      }
    };
    const onStart = (event, info) => {
      const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
      if (drag2 && !dragPropagation) {
        if (this.openDragLock)
          this.openDragLock();
        this.openDragLock = setDragLock(drag2);
        if (!this.openDragLock)
          return;
      }
      this.isDragging = true;
      this.currentDirection = null;
      this.resolveConstraints();
      if (this.visualElement.projection) {
        this.visualElement.projection.isAnimationBlocked = true;
        this.visualElement.projection.target = void 0;
      }
      eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            if (measuredAxis) {
              const length = calcLength(measuredAxis);
              current = length * (parseFloat(current) / 100);
            }
          }
        }
        this.originPoint[axis] = current;
      });
      if (onDragStart) {
        frame.postRender(() => onDragStart(event, info));
      }
      addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", true);
    };
    const onMove = (event, info) => {
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset);
        if (this.currentDirection !== null) {
          onDirectionLock && onDirectionLock(this.currentDirection);
        }
        return;
      }
      this.updateAxis("x", info.point, offset);
      this.updateAxis("y", info.point, offset);
      this.visualElement.render();
      onDrag && onDrag(event, info);
    };
    const onSessionEnd = (event, info) => this.stop(event, info);
    const resumeAnimation = () => eachAxis((axis) => {
      var _a2;
      return this.getAnimationState(axis) === "paused" && ((_a2 = this.getAxisMotionValue(axis).animation) === null || _a2 === void 0 ? void 0 : _a2.play());
    });
    const { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      contextWindow: getContextWindow(this.visualElement)
    });
  }
  stop(event, info) {
    const isDragging2 = this.isDragging;
    this.cancel();
    if (!isDragging2)
      return;
    const { velocity } = info;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    if (onDragEnd) {
      frame.postRender(() => onDragEnd(event, info));
    }
  }
  cancel() {
    this.isDragging = false;
    const { projection, animationState } = this.visualElement;
    if (projection) {
      projection.isAnimationBlocked = false;
    }
    this.panSession && this.panSession.end();
    this.panSession = void 0;
    const { dragPropagation } = this.getProps();
    if (!dragPropagation && this.openDragLock) {
      this.openDragLock();
      this.openDragLock = null;
    }
    animationState && animationState.setActive("whileDrag", false);
  }
  updateAxis(axis, _point, offset) {
    const { drag: drag2 } = this.getProps();
    if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next = this.originPoint[axis] + offset[axis];
    if (this.constraints && this.constraints[axis]) {
      next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
    }
    axisValue.set(next);
  }
  resolveConstraints() {
    var _a2;
    const { dragConstraints, dragElastic } = this.getProps();
    const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : (_a2 = this.visualElement.projection) === null || _a2 === void 0 ? void 0 : _a2.layout;
    const prevConstraints = this.constraints;
    if (dragConstraints && isRefObject(dragConstraints)) {
      if (!this.constraints) {
        this.constraints = this.resolveRefConstraints();
      }
    } else {
      if (dragConstraints && layout2) {
        this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
      } else {
        this.constraints = false;
      }
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (prevConstraints !== this.constraints && layout2 && this.constraints && !this.hasMutatedConstraints) {
      eachAxis((axis) => {
        if (this.constraints !== false && this.getAxisMotionValue(axis)) {
          this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
        }
      });
    }
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return false;
    const constraintsElement = constraints.current;
    invariant(constraintsElement !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return false;
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToBox(userConstraints);
      }
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
    const constraints = this.constraints || {};
    const momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, this.currentDirection)) {
        return;
      }
      let transition = constraints && constraints[axis] || {};
      if (dragSnapToOrigin)
        transition = { min: 0, max: 0 };
      const bounceStiffness = dragElastic ? 200 : 1e6;
      const bounceDamping = dragElastic ? 40 : 1e7;
      const inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    addValueToWillChange(this.visualElement, axis);
    return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  pauseAnimation() {
    eachAxis((axis) => {
      var _a2;
      return (_a2 = this.getAxisMotionValue(axis).animation) === null || _a2 === void 0 ? void 0 : _a2.pause();
    });
  }
  getAnimationState(axis) {
    var _a2;
    return (_a2 = this.getAxisMotionValue(axis).animation) === null || _a2 === void 0 ? void 0 : _a2.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`;
    const props = this.visualElement.getProps();
    const externalMotionValue = props[dragKey];
    return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
  }
  snapToCursor(point2) {
    eachAxis((axis) => {
      const { drag: drag2 } = this.getProps();
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      const { projection } = this.visualElement;
      const axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min, max } = projection.layout.layoutBox[axis];
        axisValue.set(point2[axis] - mixNumber$1(min, max, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: drag2, dragConstraints } = this.getProps();
    const { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== false) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    projection.root && projection.root.updateScroll();
    projection.updateLayout();
    this.resolveConstraints();
    eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, null))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      const { min, max } = this.constraints[axis];
      axisValue.set(mixNumber$1(min, max, boxProgress[axis]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current;
    const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag: drag2, dragListener = true } = this.getProps();
      drag2 && dragListener && this.start(event);
    });
    const measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      if (isRefObject(dragConstraints) && dragConstraints.current) {
        this.constraints = this.resolveRefConstraints();
      }
    };
    const { projection } = this.visualElement;
    const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    if (projection && !projection.layout) {
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
    }
    frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
    const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
      if (this.isDragging && hasLayoutChanged) {
        eachAxis((axis) => {
          const motionValue2 = this.getAxisMotionValue(axis);
          if (!motionValue2)
            return;
          this.originPoint[axis] += delta[axis].translate;
          motionValue2.set(motionValue2.get() + delta[axis].translate);
        });
        this.visualElement.render();
      }
    }));
    return () => {
      stopResizeListener();
      stopPointerListener();
      stopMeasureLayoutListener();
      stopLayoutUpdateListener && stopLayoutUpdateListener();
    };
  }
  getProps() {
    const props = this.visualElement.getProps();
    const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
    return {
      ...props,
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
}
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
  let direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}
class DragGesture extends Feature {
  constructor(node) {
    super(node);
    this.removeGroupControls = noop;
    this.removeListeners = noop;
    this.controls = new VisualElementDragControls(node);
  }
  mount() {
    const { dragControls } = this.node.getProps();
    if (dragControls) {
      this.removeGroupControls = dragControls.subscribe(this.controls);
    }
    this.removeListeners = this.controls.addListeners() || noop;
  }
  unmount() {
    this.removeGroupControls();
    this.removeListeners();
  }
}
const asyncHandler = (handler) => (event, info) => {
  if (handler) {
    frame.postRender(() => handler(event, info));
  }
};
class PanGesture extends Feature {
  constructor() {
    super(...arguments);
    this.removePointerDownListener = noop;
  }
  onPointerDown(pointerDownEvent) {
    this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: getContextWindow(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
    return {
      onSessionStart: asyncHandler(onPanSessionStart),
      onStart: asyncHandler(onPanStart),
      onMove: onPan,
      onEnd: (event, info) => {
        delete this.session;
        if (onPanEnd) {
          frame.postRender(() => onPanEnd(event, info));
        }
      }
    };
  }
  mount() {
    this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener();
    this.session && this.session.end();
  }
}
const globalProjectionState = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: true,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: false
};
function pixelsToPercent(pixels, axis) {
  if (axis.max === axis.min)
    return 0;
  return pixels / (axis.max - axis.min) * 100;
}
const correctBorderRadius = {
  correct: (latest, node) => {
    if (!node.target)
      return latest;
    if (typeof latest === "string") {
      if (px.test(latest)) {
        latest = parseFloat(latest);
      } else {
        return latest;
      }
    }
    const x = pixelsToPercent(latest, node.target.x);
    const y = pixelsToPercent(latest, node.target.y);
    return `${x}% ${y}%`;
  }
};
const correctBoxShadow = {
  correct: (latest, { treeScale, projectionDelta }) => {
    const original = latest;
    const shadow = complex.parse(latest);
    if (shadow.length > 5)
      return original;
    const template = complex.createTransformer(latest);
    const offset = typeof shadow[0] !== "number" ? 1 : 0;
    const xScale = projectionDelta.x.scale * treeScale.x;
    const yScale = projectionDelta.y.scale * treeScale.y;
    shadow[0 + offset] /= xScale;
    shadow[1 + offset] /= yScale;
    const averageScale = mixNumber$1(xScale, yScale, 0.5);
    if (typeof shadow[2 + offset] === "number")
      shadow[2 + offset] /= averageScale;
    if (typeof shadow[3 + offset] === "number")
      shadow[3 + offset] /= averageScale;
    return template(shadow);
  }
};
class MeasureLayoutWithContext extends Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
    const { projection } = visualElement;
    addScaleCorrector(defaultScaleCorrectors);
    if (projection) {
      if (layoutGroup.group)
        layoutGroup.group.add(projection);
      if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
        switchLayoutGroup.register(projection);
      }
      projection.root.didUpdate();
      projection.addEventListener("animationComplete", () => {
        this.safeToRemove();
      });
      projection.setOptions({
        ...projection.options,
        onExitComplete: () => this.safeToRemove()
      });
    }
    globalProjectionState.hasEverUpdated = true;
  }
  getSnapshotBeforeUpdate(prevProps) {
    const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
    const projection = visualElement.projection;
    if (!projection)
      return null;
    projection.isPresent = isPresent;
    if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0) {
      projection.willUpdate();
    } else {
      this.safeToRemove();
    }
    if (prevProps.isPresent !== isPresent) {
      if (isPresent) {
        projection.promote();
      } else if (!projection.relegate()) {
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            this.safeToRemove();
          }
        });
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { projection } = this.props.visualElement;
    if (projection) {
      projection.root.didUpdate();
      microtask.postRender(() => {
        if (!projection.currentAnimation && projection.isLead()) {
          this.safeToRemove();
        }
      });
    }
  }
  componentWillUnmount() {
    const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
    const { projection } = visualElement;
    if (projection) {
      projection.scheduleCheckAfterUnmount();
      if (layoutGroup && layoutGroup.group)
        layoutGroup.group.remove(projection);
      if (promoteContext && promoteContext.deregister)
        promoteContext.deregister(projection);
    }
  }
  safeToRemove() {
    const { safeToRemove } = this.props;
    safeToRemove && safeToRemove();
  }
  render() {
    return null;
  }
}
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence();
  const layoutGroup = useContext(LayoutGroupContext);
  return jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
const defaultScaleCorrectors = {
  borderRadius: {
    ...correctBorderRadius,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: correctBorderRadius,
  borderTopRightRadius: correctBorderRadius,
  borderBottomLeftRadius: correctBorderRadius,
  borderBottomRightRadius: correctBorderRadius,
  boxShadow: correctBoxShadow
};
function animateSingleValue(value, keyframes2, options) {
  const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
  motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
  return motionValue$1.animation;
}
function isSVGElement(element) {
  return element instanceof SVGElement && element.tagName !== "svg";
}
const compareByDepth = (a, b) => a.depth - b.depth;
class FlatTree {
  constructor() {
    this.children = [];
    this.isDirty = false;
  }
  add(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  }
  remove(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    this.isDirty = false;
    this.children.forEach(callback);
  }
}
function delay(callback, timeout) {
  const start = time.now();
  const checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    if (elapsed >= timeout) {
      cancelFrame(checkElapsed);
      callback(elapsed - timeout);
    }
  };
  frame.read(checkElapsed, true);
  return () => cancelFrame(checkElapsed);
}
const borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
const numBorders = borders.length;
const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
const isPx = (value) => typeof value === "number" || px.test(value);
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  if (shouldCrossfadeOpacity) {
    target.opacity = mixNumber$1(
      0,
      // TODO Reinstate this if only child
      lead.opacity !== void 0 ? lead.opacity : 1,
      easeCrossfadeIn(progress2)
    );
    target.opacityExit = mixNumber$1(follow.opacity !== void 0 ? follow.opacity : 1, 0, easeCrossfadeOut(progress2));
  } else if (isOnlyMember) {
    target.opacity = mixNumber$1(follow.opacity !== void 0 ? follow.opacity : 1, lead.opacity !== void 0 ? lead.opacity : 1, progress2);
  }
  for (let i = 0; i < numBorders; i++) {
    const borderLabel = `border${borders[i]}Radius`;
    let followRadius = getRadius(follow, borderLabel);
    let leadRadius = getRadius(lead, borderLabel);
    if (followRadius === void 0 && leadRadius === void 0)
      continue;
    followRadius || (followRadius = 0);
    leadRadius || (leadRadius = 0);
    const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
    if (canMix) {
      target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
      if (percent.test(leadRadius) || percent.test(followRadius)) {
        target[borderLabel] += "%";
      }
    } else {
      target[borderLabel] = leadRadius;
    }
  }
  if (follow.rotate || lead.rotate) {
    target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2);
  }
}
function getRadius(values, radiusName) {
  return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
const easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut);
const easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop);
function compress(min, max, easing) {
  return (p) => {
    if (p < min)
      return 0;
    if (p > max)
      return 1;
    return easing(/* @__PURE__ */ progress(min, max, p));
  };
}
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x);
  copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate;
  delta.scale = originDelta.scale;
  delta.originPoint = originDelta.originPoint;
  delta.origin = originDelta.origin;
}
function removePointDelta(point2, translate, scale2, originPoint, boxScale) {
  point2 -= translate;
  point2 = scalePoint(point2, 1 / scale2, originPoint);
  if (boxScale !== void 0) {
    point2 = scalePoint(point2, 1 / boxScale, originPoint);
  }
  return point2;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate)) {
    translate = parseFloat(translate);
    const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
    translate = relativeProgress - sourceAxis.min;
  }
  if (typeof translate !== "number")
    return;
  let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
  if (axis === originAxis)
    originPoint -= translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
const xKeys = ["x", "scaleX", "originX"];
const yKeys = ["y", "scaleY", "originY"];
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
  removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
  return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
  return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
  return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
  return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
  return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}
class NodeStack {
  constructor() {
    this.members = [];
  }
  add(node) {
    addUniqueItem(this.members, node);
    node.scheduleRender();
  }
  remove(node) {
    removeItem(this.members, node);
    if (node === this.prevLead) {
      this.prevLead = void 0;
    }
    if (node === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      if (prevLead) {
        this.promote(prevLead);
      }
    }
  }
  relegate(node) {
    const indexOfNode = this.members.findIndex((member) => node === member);
    if (indexOfNode === 0)
      return false;
    let prevLead;
    for (let i = indexOfNode; i >= 0; i--) {
      const member = this.members[i];
      if (member.isPresent !== false) {
        prevLead = member;
        break;
      }
    }
    if (prevLead) {
      this.promote(prevLead);
      return true;
    } else {
      return false;
    }
  }
  promote(node, preserveFollowOpacity) {
    const prevLead = this.lead;
    if (node === prevLead)
      return;
    this.prevLead = prevLead;
    this.lead = node;
    node.show();
    if (prevLead) {
      prevLead.instance && prevLead.scheduleRender();
      node.scheduleRender();
      node.resumeFrom = prevLead;
      if (preserveFollowOpacity) {
        node.resumeFrom.preserveOpacity = true;
      }
      if (prevLead.snapshot) {
        node.snapshot = prevLead.snapshot;
        node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
      }
      if (node.root && node.root.isUpdating) {
        node.isLayoutDirty = true;
      }
      const { crossfade } = node.options;
      if (crossfade === false) {
        prevLead.hide();
      }
    }
  }
  exitAnimationComplete() {
    this.members.forEach((node) => {
      const { options, resumingFrom } = node;
      options.onExitComplete && options.onExitComplete();
      if (resumingFrom) {
        resumingFrom.options.onExitComplete && resumingFrom.options.onExitComplete();
      }
    });
  }
  scheduleRender() {
    this.members.forEach((node) => {
      node.instance && node.scheduleRender(false);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    if (this.lead && this.lead.snapshot) {
      this.lead.snapshot = void 0;
    }
  }
}
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform2 = "";
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  const zTranslate = (latestTransform === null || latestTransform === void 0 ? void 0 : latestTransform.z) || 0;
  if (xTranslate || yTranslate || zTranslate) {
    transform2 = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
  }
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform2 += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { transformPerspective, rotate, rotateX, rotateY, skewX, skewY } = latestTransform;
    if (transformPerspective)
      transform2 = `perspective(${transformPerspective}px) ${transform2}`;
    if (rotate)
      transform2 += `rotate(${rotate}deg) `;
    if (rotateX)
      transform2 += `rotateX(${rotateX}deg) `;
    if (rotateY)
      transform2 += `rotateY(${rotateY}deg) `;
    if (skewX)
      transform2 += `skewX(${skewX}deg) `;
    if (skewY)
      transform2 += `skewY(${skewY}deg) `;
  }
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform2 += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform2 || "none";
}
const metrics = {
  type: "projectionFrame",
  totalNodes: 0,
  resolvedTargetDeltas: 0,
  recalculatedProjection: 0
};
const isDebug = typeof window !== "undefined" && window.MotionDebug !== void 0;
const transformAxes = ["", "X", "Y", "Z"];
const hiddenVisibility = { visibility: "hidden" };
const animationTarget = 1e3;
let id = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  if (latestValues[key]) {
    values[key] = latestValues[key];
    visualElement.setStaticValue(key, 0);
    if (sharedAnimationValues) {
      sharedAnimationValues[key] = 0;
    }
  }
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  projectionNode.hasCheckedOptimisedAppear = true;
  if (projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout: layout2, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
  }
  const { parent } = projectionNode;
  if (parent && !parent.hasCheckedOptimisedAppear) {
    cancelTreeOptimisedTransformAnimations(parent);
  }
}
function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class ProjectionNode {
    constructor(latestValues = {}, parent = defaultParent === null || defaultParent === void 0 ? void 0 : defaultParent()) {
      this.id = id++;
      this.animationId = 0;
      this.children = /* @__PURE__ */ new Set();
      this.options = {};
      this.isTreeAnimating = false;
      this.isAnimationBlocked = false;
      this.isLayoutDirty = false;
      this.isProjectionDirty = false;
      this.isSharedProjectionDirty = false;
      this.isTransformDirty = false;
      this.updateManuallyBlocked = false;
      this.updateBlockedByResize = false;
      this.isUpdating = false;
      this.isSVG = false;
      this.needsReset = false;
      this.shouldResetTransform = false;
      this.hasCheckedOptimisedAppear = false;
      this.treeScale = { x: 1, y: 1 };
      this.eventHandlers = /* @__PURE__ */ new Map();
      this.hasTreeAnimated = false;
      this.updateScheduled = false;
      this.scheduleUpdate = () => this.update();
      this.projectionUpdateScheduled = false;
      this.checkUpdateFailed = () => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.clearAllSnapshots();
        }
      };
      this.updateProjection = () => {
        this.projectionUpdateScheduled = false;
        if (isDebug) {
          metrics.totalNodes = metrics.resolvedTargetDeltas = metrics.recalculatedProjection = 0;
        }
        this.nodes.forEach(propagateDirtyNodes);
        this.nodes.forEach(resolveTargetDelta);
        this.nodes.forEach(calcProjection);
        this.nodes.forEach(cleanDirtyNodes);
        if (isDebug) {
          window.MotionDebug.record(metrics);
        }
      };
      this.resolvedRelativeTargetAt = 0;
      this.hasProjected = false;
      this.isVisible = true;
      this.animationProgress = 0;
      this.sharedNodes = /* @__PURE__ */ new Map();
      this.latestValues = latestValues;
      this.root = parent ? parent.root || parent : this;
      this.path = parent ? [...parent.path, parent] : [];
      this.parent = parent;
      this.depth = parent ? parent.depth + 1 : 0;
      for (let i = 0; i < this.path.length; i++) {
        this.path[i].shouldResetTransform = true;
      }
      if (this.root === this)
        this.nodes = new FlatTree();
    }
    addEventListener(name, handler) {
      if (!this.eventHandlers.has(name)) {
        this.eventHandlers.set(name, new SubscriptionManager());
      }
      return this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    /**
     * Lifecycles
     */
    mount(instance, isLayoutDirty = this.root.hasTreeAnimated) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance);
      this.instance = instance;
      const { layoutId, layout: layout2, visualElement } = this.options;
      if (visualElement && !visualElement.current) {
        visualElement.mount(instance);
      }
      this.root.nodes.add(this);
      this.parent && this.parent.children.add(this);
      if (isLayoutDirty && (layout2 || layoutId)) {
        this.isLayoutDirty = true;
      }
      if (attachResizeListener) {
        let cancelDelay;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
        attachResizeListener(instance, () => {
          this.root.updateBlockedByResize = true;
          cancelDelay && cancelDelay();
          cancelDelay = delay(resizeUnblockUpdate, 250);
          if (globalProjectionState.hasAnimatedSinceResize) {
            globalProjectionState.hasAnimatedSinceResize = false;
            this.nodes.forEach(finishAnimation);
          }
        });
      }
      if (layoutId) {
        this.root.registerSharedNode(layoutId, this);
      }
      if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
        this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeTargetChanged, layout: newLayout }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0;
            this.relativeTarget = void 0;
            return;
          }
          const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
          const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
          const targetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout) || hasRelativeTargetChanged;
          const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeTargetChanged;
          if (this.options.layoutRoot || this.resumeFrom && this.resumeFrom.instance || hasOnlyRelativeTargetChanged || hasLayoutChanged && (targetChanged || !this.currentAnimation)) {
            if (this.resumeFrom) {
              this.resumingFrom = this.resumeFrom;
              this.resumingFrom.resumingFrom = void 0;
            }
            this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
            const animationOptions = {
              ...getValueTransition(layoutTransition, "layout"),
              onPlay: onLayoutAnimationStart,
              onComplete: onLayoutAnimationComplete
            };
            if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
              animationOptions.delay = 0;
              animationOptions.type = false;
            }
            this.startAnimation(animationOptions);
          } else {
            if (!hasLayoutChanged) {
              finishAnimation(this);
            }
            if (this.isLead() && this.options.onExitComplete) {
              this.options.onExitComplete();
            }
          }
          this.targetLayout = newLayout;
        });
      }
    }
    unmount() {
      this.options.layoutId && this.willUpdate();
      this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this);
      this.parent && this.parent.children.delete(this);
      this.instance = void 0;
      cancelFrame(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    // Note: currently only running on root node
    startUpdate() {
      if (this.isUpdateBlocked())
        return;
      this.isUpdating = true;
      this.nodes && this.nodes.forEach(resetSkewAndRotation);
      this.animationId++;
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = true) {
      this.root.hasTreeAnimated = true;
      if (this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
        cancelTreeOptimisedTransformAnimations(this);
      }
      !this.root.isUpdating && this.root.startUpdate();
      if (this.isLayoutDirty)
        return;
      this.isLayoutDirty = true;
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        node.shouldResetTransform = true;
        node.updateScroll("snapshot");
        if (node.options.layoutRoot) {
          node.willUpdate(false);
        }
      }
      const { layoutId, layout: layout2 } = this.options;
      if (layoutId === void 0 && !layout2)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      this.updateSnapshot();
      shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      this.updateScheduled = false;
      const updateWasBlocked = this.isUpdateBlocked();
      if (updateWasBlocked) {
        this.unblockUpdate();
        this.clearAllSnapshots();
        this.nodes.forEach(clearMeasurements);
        return;
      }
      if (!this.isUpdating) {
        this.nodes.forEach(clearIsLayoutDirty);
      }
      this.isUpdating = false;
      this.nodes.forEach(resetTransformStyle);
      this.nodes.forEach(updateLayout);
      this.nodes.forEach(notifyLayoutUpdate);
      this.clearAllSnapshots();
      const now2 = time.now();
      frameData.delta = clamp(0, 1e3 / 60, now2 - frameData.timestamp);
      frameData.timestamp = now2;
      frameData.isProcessing = true;
      frameSteps.update.process(frameData);
      frameSteps.preRender.process(frameData);
      frameSteps.render.process(frameData);
      frameData.isProcessing = false;
    }
    didUpdate() {
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        microtask.read(this.scheduleUpdate);
      }
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot);
      this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      if (!this.projectionUpdateScheduled) {
        this.projectionUpdateScheduled = true;
        frame.preRender(this.updateProjection, false, true);
      }
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        if (this.isLayoutDirty) {
          this.root.didUpdate();
        } else {
          this.root.checkUpdateFailed();
        }
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      if (this.snapshot || !this.instance)
        return;
      this.snapshot = this.measure();
    }
    updateLayout() {
      if (!this.instance)
        return;
      this.updateScroll();
      if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
        return;
      }
      if (this.resumeFrom && !this.resumeFrom.instance) {
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          node.updateScroll();
        }
      }
      const prevLayout = this.layout;
      this.layout = this.measure(false);
      this.layoutCorrected = createBox();
      this.isLayoutDirty = false;
      this.projectionDelta = void 0;
      this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
        needsMeasurement = false;
      }
      if (needsMeasurement) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
      const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
      const transformTemplate = this.getTransformTemplate();
      const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      if (isResetRequested && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
        resetTransform(this.instance, transformTemplateValue);
        this.shouldResetTransform = false;
        this.scheduleRender();
      }
    }
    measure(removeTransform = true) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      if (removeTransform) {
        layoutBox = this.removeTransform(layoutBox);
      }
      roundBox(layoutBox);
      return {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var _a2;
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      const wasInScrollRoot = ((_a2 = this.scroll) === null || _a2 === void 0 ? void 0 : _a2.wasRoot) || this.path.some(checkNodeWasScrollRoot);
      if (!wasInScrollRoot) {
        const { scroll: scroll2 } = this.root;
        if (scroll2) {
          translateAxis(box.x, scroll2.offset.x);
          translateAxis(box.y, scroll2.offset.y);
        }
      }
      return box;
    }
    removeElementScroll(box) {
      var _a2;
      const boxWithoutScroll = createBox();
      copyBoxInto(boxWithoutScroll, box);
      if ((_a2 = this.scroll) === null || _a2 === void 0 ? void 0 : _a2.wasRoot) {
        return boxWithoutScroll;
      }
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        const { scroll: scroll2, options } = node;
        if (node !== this.root && scroll2 && options.layoutScroll) {
          if (scroll2.wasRoot) {
            copyBoxInto(boxWithoutScroll, box);
          }
          translateAxis(boxWithoutScroll.x, scroll2.offset.x);
          translateAxis(boxWithoutScroll.y, scroll2.offset.y);
        }
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = false) {
      const withTransforms = createBox();
      copyBoxInto(withTransforms, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
          transformBox(withTransforms, {
            x: -node.scroll.offset.x,
            y: -node.scroll.offset.y
          });
        }
        if (!hasTransform(node.latestValues))
          continue;
        transformBox(withTransforms, node.latestValues);
      }
      if (hasTransform(this.latestValues)) {
        transformBox(withTransforms, this.latestValues);
      }
      return withTransforms;
    }
    removeTransform(box) {
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!node.instance)
          continue;
        if (!hasTransform(node.latestValues))
          continue;
        hasScale(node.latestValues) && node.updateSnapshot();
        const sourceBox = createBox();
        const nodeBox = node.measurePageBox();
        copyBoxInto(sourceBox, nodeBox);
        removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot ? node.snapshot.layoutBox : void 0, sourceBox);
      }
      if (hasTransform(this.latestValues)) {
        removeBoxTransforms(boxWithoutTransform, this.latestValues);
      }
      return boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta;
      this.root.scheduleUpdateProjection();
      this.isProjectionDirty = true;
    }
    setOptions(options) {
      this.options = {
        ...this.options,
        ...options,
        crossfade: options.crossfade !== void 0 ? options.crossfade : true
      };
    }
    clearMeasurements() {
      this.scroll = void 0;
      this.layout = void 0;
      this.snapshot = void 0;
      this.prevTransformTemplateValue = void 0;
      this.targetDelta = void 0;
      this.target = void 0;
      this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      if (!this.relativeParent)
        return;
      if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
        this.relativeParent.resolveTargetDelta(true);
      }
    }
    resolveTargetDelta(forceRecalculation = false) {
      var _a2;
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
      this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
      this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || ((_a2 = this.parent) === null || _a2 === void 0 ? void 0 : _a2.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      if (!this.layout || !(layout2 || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      if (!this.targetDelta && !this.relativeTarget) {
        const relativeParent = this.getClosestProjectingParent();
        if (relativeParent && relativeParent.layout && this.animationProgress !== 1) {
          this.relativeParent = relativeParent;
          this.forceRelativeParentToResolveTarget();
          this.relativeTarget = createBox();
          this.relativeTargetOrigin = createBox();
          calcRelativePosition(this.relativeTargetOrigin, this.layout.layoutBox, relativeParent.layout.layoutBox);
          copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
      if (!this.relativeTarget && !this.targetDelta)
        return;
      if (!this.target) {
        this.target = createBox();
        this.targetWithTransforms = createBox();
      }
      if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
        this.forceRelativeParentToResolveTarget();
        calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target);
      } else if (this.targetDelta) {
        if (Boolean(this.resumingFrom)) {
          this.target = this.applyTransform(this.layout.layoutBox);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        applyBoxDelta(this.target, this.targetDelta);
      } else {
        copyBoxInto(this.target, this.layout.layoutBox);
      }
      if (this.attemptToResolveRelativeTarget) {
        this.attemptToResolveRelativeTarget = false;
        const relativeParent = this.getClosestProjectingParent();
        if (relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
          this.relativeParent = relativeParent;
          this.forceRelativeParentToResolveTarget();
          this.relativeTarget = createBox();
          this.relativeTargetOrigin = createBox();
          calcRelativePosition(this.relativeTargetOrigin, this.target, relativeParent.target);
          copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
      if (isDebug) {
        metrics.resolvedTargetDeltas++;
      }
    }
    getClosestProjectingParent() {
      if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
        return void 0;
      }
      if (this.parent.isProjecting()) {
        return this.parent;
      } else {
        return this.parent.getClosestProjectingParent();
      }
    }
    isProjecting() {
      return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var _a2;
      const lead = this.getLead();
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      let canSkip = true;
      if (this.isProjectionDirty || ((_a2 = this.parent) === null || _a2 === void 0 ? void 0 : _a2.isProjectionDirty)) {
        canSkip = false;
      }
      if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
        canSkip = false;
      }
      if (this.resolvedRelativeTargetAt === frameData.timestamp) {
        canSkip = false;
      }
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
      if (!this.isTreeAnimating) {
        this.targetDelta = this.relativeTarget = void 0;
      }
      if (!this.layout || !(layout2 || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x;
      const prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
      if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
        lead.target = lead.layout.layoutBox;
        lead.targetWithTransforms = createBox();
      }
      const { target } = lead;
      if (!target) {
        if (this.prevProjectionDelta) {
          this.createProjectionDeltas();
          this.scheduleRender();
        }
        return;
      }
      if (!this.projectionDelta || !this.prevProjectionDelta) {
        this.createProjectionDeltas();
      } else {
        copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
        copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
      }
      calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
      if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
        this.hasProjected = true;
        this.scheduleRender();
        this.notifyListeners("projectionUpdate", target);
      }
      if (isDebug) {
        metrics.recalculatedProjection++;
      }
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(notifyAll2 = true) {
      var _a2;
      (_a2 = this.options.visualElement) === null || _a2 === void 0 ? void 0 : _a2.scheduleRender();
      if (notifyAll2) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      if (this.resumingFrom && !this.resumingFrom.instance) {
        this.resumingFrom = void 0;
      }
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta();
      this.projectionDelta = createDelta();
      this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
      const snapshot = this.snapshot;
      const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
      const mixedValues = { ...this.latestValues };
      const targetDelta = createDelta();
      if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
        this.relativeTarget = this.relativeTargetOrigin = void 0;
      }
      this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox();
      const snapshotSource = snapshot ? snapshot.source : void 0;
      const layoutSource = this.layout ? this.layout.source : void 0;
      const isSharedLayoutAnimation = snapshotSource !== layoutSource;
      const stack = this.getStack();
      const isOnlyMember = !stack || stack.members.length <= 1;
      const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1e3;
        mixAxisDelta(targetDelta.x, delta.x, progress2);
        mixAxisDelta(targetDelta.y, delta.y, progress2);
        this.setTargetDelta(targetDelta);
        if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
          calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox);
          mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
          if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
            this.isProjectionDirty = false;
          }
          if (!prevRelativeTarget)
            prevRelativeTarget = createBox();
          copyBoxInto(prevRelativeTarget, this.relativeTarget);
        }
        if (isSharedLayoutAnimation) {
          this.animationValues = mixedValues;
          mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
        }
        this.root.scheduleUpdateProjection();
        this.scheduleRender();
        this.animationProgress = progress2;
      };
      this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(options) {
      this.notifyListeners("animationStart");
      this.currentAnimation && this.currentAnimation.stop();
      if (this.resumingFrom && this.resumingFrom.currentAnimation) {
        this.resumingFrom.currentAnimation.stop();
      }
      if (this.pendingAnimation) {
        cancelFrame(this.pendingAnimation);
        this.pendingAnimation = void 0;
      }
      this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = true;
        this.currentAnimation = animateSingleValue(0, animationTarget, {
          ...options,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest);
            options.onUpdate && options.onUpdate(latest);
          },
          onComplete: () => {
            options.onComplete && options.onComplete();
            this.completeAnimation();
          }
        });
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = this.currentAnimation;
        }
        this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      if (this.resumingFrom) {
        this.resumingFrom.currentAnimation = void 0;
        this.resumingFrom.preserveOpacity = void 0;
      }
      const stack = this.getStack();
      stack && stack.exitAnimationComplete();
      this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
      this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      if (this.currentAnimation) {
        this.mixTargetDelta && this.mixTargetDelta(animationTarget);
        this.currentAnimation.stop();
      }
      this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
      if (!targetWithTransforms || !target || !layout2)
        return;
      if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
        target = this.target || createBox();
        const xLength = calcLength(this.layout.layoutBox.x);
        target.x.min = lead.target.x.min;
        target.x.max = target.x.min + xLength;
        const yLength = calcLength(this.layout.layoutBox.y);
        target.y.min = lead.target.y.min;
        target.y.max = target.y.min + yLength;
      }
      copyBoxInto(targetWithTransforms, target);
      transformBox(targetWithTransforms, latestValues);
      calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
    }
    registerSharedNode(layoutId, node) {
      if (!this.sharedNodes.has(layoutId)) {
        this.sharedNodes.set(layoutId, new NodeStack());
      }
      const stack = this.sharedNodes.get(layoutId);
      stack.add(node);
      const config = node.options.initialPromotionConfig;
      node.promote({
        transition: config ? config.transition : void 0,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : true;
    }
    getLead() {
      var _a2;
      const { layoutId } = this.options;
      return layoutId ? ((_a2 = this.getStack()) === null || _a2 === void 0 ? void 0 : _a2.lead) || this : this;
    }
    getPrevLead() {
      var _a2;
      const { layoutId } = this.options;
      return layoutId ? (_a2 = this.getStack()) === null || _a2 === void 0 ? void 0 : _a2.prevLead : void 0;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      if (stack)
        stack.promote(this, preserveFollowOpacity);
      if (needsReset) {
        this.projectionDelta = void 0;
        this.needsReset = true;
      }
      if (transition)
        this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      if (stack) {
        return stack.relegate(this);
      } else {
        return false;
      }
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = false;
      const { latestValues } = visualElement;
      if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
        hasDistortingTransform = true;
      }
      if (!hasDistortingTransform)
        return;
      const resetValues = {};
      if (latestValues.z) {
        resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      }
      for (let i = 0; i < transformAxes.length; i++) {
        resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
      }
      visualElement.render();
      for (const key in resetValues) {
        visualElement.setStaticValue(key, resetValues[key]);
        if (this.animationValues) {
          this.animationValues[key] = resetValues[key];
        }
      }
      visualElement.scheduleRender();
    }
    getProjectionStyles(styleProp) {
      var _a2, _b;
      if (!this.instance || this.isSVG)
        return void 0;
      if (!this.isVisible) {
        return hiddenVisibility;
      }
      const styles = {
        visibility: ""
      };
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false;
        styles.opacity = "";
        styles.pointerEvents = resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "";
        styles.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return styles;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        const emptyStyles = {};
        if (this.options.layoutId) {
          emptyStyles.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
          emptyStyles.pointerEvents = resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "";
        }
        if (this.hasProjected && !hasTransform(this.latestValues)) {
          emptyStyles.transform = transformTemplate ? transformTemplate({}, "") : "none";
          this.hasProjected = false;
        }
        return emptyStyles;
      }
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      styles.transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      if (transformTemplate) {
        styles.transform = transformTemplate(valuesToRender, styles.transform);
      }
      const { x, y } = this.projectionDelta;
      styles.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
      if (lead.animationValues) {
        styles.opacity = lead === this ? (_b = (_a2 = valuesToRender.opacity) !== null && _a2 !== void 0 ? _a2 : this.latestValues.opacity) !== null && _b !== void 0 ? _b : 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
      } else {
        styles.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
      }
      for (const key in scaleCorrectors) {
        if (valuesToRender[key] === void 0)
          continue;
        const { correct, applyTo } = scaleCorrectors[key];
        const corrected = styles.transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
        if (applyTo) {
          const num = applyTo.length;
          for (let i = 0; i < num; i++) {
            styles[applyTo[i]] = corrected;
          }
        } else {
          styles[key] = corrected;
        }
      }
      if (this.options.layoutId) {
        styles.pointerEvents = lead === this ? resolveMotionValue(styleProp === null || styleProp === void 0 ? void 0 : styleProp.pointerEvents) || "" : "none";
      }
      return styles;
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((node) => {
        var _a2;
        return (_a2 = node.currentAnimation) === null || _a2 === void 0 ? void 0 : _a2.stop();
      });
      this.root.nodes.forEach(clearMeasurements);
      this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node) {
  node.updateLayout();
}
function notifyLayoutUpdate(node) {
  var _a2;
  const snapshot = ((_a2 = node.resumeFrom) === null || _a2 === void 0 ? void 0 : _a2.snapshot) || node.snapshot;
  if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
    const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout;
    const { animationType } = node.options;
    const isShared = snapshot.source !== node.layout.source;
    if (animationType === "size") {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(axisSnapshot);
        axisSnapshot.min = layout2[axis].min;
        axisSnapshot.max = axisSnapshot.min + length;
      });
    } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2)) {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(layout2[axis]);
        axisSnapshot.max = axisSnapshot.min + length;
        if (node.relativeTarget && !node.currentAnimation) {
          node.isProjectionDirty = true;
          node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
        }
      });
    }
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
    const visualDelta = createDelta();
    if (isShared) {
      calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
    } else {
      calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
    }
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeTargetChanged = false;
    if (!node.resumeFrom) {
      const relativeParent = node.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox);
          if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
            hasRelativeTargetChanged = true;
          }
          if (relativeParent.options.layoutRoot) {
            node.relativeTarget = relativeLayout;
            node.relativeTargetOrigin = relativeSnapshot;
            node.relativeParent = relativeParent;
          }
        }
      }
    }
    node.notifyListeners("didUpdate", {
      layout: layout2,
      snapshot,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeTargetChanged
    });
  } else if (node.isLead()) {
    const { onExitComplete } = node.options;
    onExitComplete && onExitComplete();
  }
  node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
  if (isDebug) {
    metrics.totalNodes++;
  }
  if (!node.parent)
    return;
  if (!node.isProjecting()) {
    node.isProjectionDirty = node.parent.isProjectionDirty;
  }
  node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
  node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
  node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
  node.clearSnapshot();
}
function clearMeasurements(node) {
  node.clearMeasurements();
}
function clearIsLayoutDirty(node) {
  node.isLayoutDirty = false;
}
function resetTransformStyle(node) {
  const { visualElement } = node.options;
  if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
    visualElement.notify("BeforeLayoutMeasure");
  }
  node.resetTransform();
}
function finishAnimation(node) {
  node.finishAnimation();
  node.targetDelta = node.relativeTarget = node.target = void 0;
  node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
  node.resolveTargetDelta();
}
function calcProjection(node) {
  node.calcProjection();
}
function resetSkewAndRotation(node) {
  node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
  output.translate = mixNumber$1(delta.translate, 0, p);
  output.scale = mixNumber$1(delta.scale, 1, p);
  output.origin = delta.origin;
  output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
  output.min = mixNumber$1(from.min, to.min, p);
  output.max = mixNumber$1(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
  mixAxis(output.x, from.x, to.x, p);
  mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
  return node.animationValues && node.animationValues.opacityExit !== void 0;
}
const defaultLayoutTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
};
const userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
function roundAxis(axis) {
  axis.min = roundPoint(axis.min);
  axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x);
  roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
}
function checkNodeWasScrollRoot(node) {
  var _a2;
  return node !== node.root && ((_a2 = node.scroll) === null || _a2 === void 0 ? void 0 : _a2.wasRoot);
}
const DocumentProjectionNode = createProjectionNode({
  attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => true
});
const rootProjectionNode = {
  current: void 0
};
const HTMLProjectionNode = createProjectionNode({
  measureScroll: (instance) => ({
    x: instance.scrollLeft,
    y: instance.scrollTop
  }),
  defaultParent: () => {
    if (!rootProjectionNode.current) {
      const documentNode = new DocumentProjectionNode({});
      documentNode.mount(window);
      documentNode.setOptions({ layoutScroll: true });
      rootProjectionNode.current = documentNode;
    }
    return rootProjectionNode.current;
  },
  resetTransform: (instance, value) => {
    instance.style.transform = value !== void 0 ? value : "none";
  },
  checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});
const drag = {
  pan: {
    Feature: PanGesture
  },
  drag: {
    Feature: DragGesture,
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
function resolveElements(elementOrSelector, scope, selectorCache) {
  var _a2;
  if (elementOrSelector instanceof Element) {
    return [elementOrSelector];
  } else if (typeof elementOrSelector === "string") {
    let root = document;
    const elements = (_a2 = void 0) !== null && _a2 !== void 0 ? _a2 : root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector);
}
function setupGesture(elementOrSelector, options) {
  const elements = resolveElements(elementOrSelector);
  const gestureAbortController = new AbortController();
  const eventOptions = {
    passive: true,
    ...options,
    signal: gestureAbortController.signal
  };
  const cancel = () => gestureAbortController.abort();
  return [elements, eventOptions, cancel];
}
function filterEvents$1(callback) {
  return (event) => {
    if (event.pointerType === "touch" || isDragActive())
      return;
    callback(event);
  };
}
function hover(elementOrSelector, onHoverStart, options = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
  const onPointerEnter = filterEvents$1((enterEvent) => {
    const { target } = enterEvent;
    const onHoverEnd = onHoverStart(enterEvent);
    if (typeof onHoverEnd !== "function" || !target)
      return;
    const onPointerLeave = filterEvents$1((leaveEvent) => {
      onHoverEnd(leaveEvent);
      target.removeEventListener("pointerleave", onPointerLeave);
    });
    target.addEventListener("pointerleave", onPointerLeave, eventOptions);
  });
  elements.forEach((element) => {
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
  });
  return cancel;
}
function handleHoverEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileHover) {
    node.animationState.setActive("whileHover", lifecycle === "Start");
  }
  const eventName = "onHover" + lifecycle;
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class HoverGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = hover(current, (startEvent) => {
      handleHoverEvent(this.node, startEvent, "Start");
      return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
    });
  }
  unmount() {
  }
}
class FocusGesture extends Feature {
  constructor() {
    super(...arguments);
    this.isActive = false;
  }
  onFocus() {
    let isFocusVisible = false;
    try {
      isFocusVisible = this.node.current.matches(":focus-visible");
    } catch (e) {
      isFocusVisible = true;
    }
    if (!isFocusVisible || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", true);
    this.isActive = true;
  }
  onBlur() {
    if (!this.isActive || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", false);
    this.isActive = false;
  }
  mount() {
    this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
const isNodeOrChild = (parent, child) => {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};
const focusableElements = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function isElementKeyboardAccessible(element) {
  return focusableElements.has(element.tagName) || element.tabIndex !== -1;
}
const isPressing = /* @__PURE__ */ new WeakSet();
function filterEvents(callback) {
  return (event) => {
    if (event.key !== "Enter")
      return;
    callback(event);
  };
}
function firePointerEvent(target, type) {
  target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
}
const enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents(() => {
      firePointerEvent(element, "up");
    });
    const handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions);
    element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions);
  element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
function press(elementOrSelector, onPressStart, options = {}) {
  const [elements, eventOptions, cancelEvents] = setupGesture(elementOrSelector, options);
  const startPress = (startEvent) => {
    const element = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent) || isPressing.has(element))
      return;
    isPressing.add(element);
    const onPressEnd = onPressStart(startEvent);
    const onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (!isValidPressEvent(endEvent) || !isPressing.has(element)) {
        return;
      }
      isPressing.delete(element);
      if (typeof onPressEnd === "function") {
        onPressEnd(endEvent, { success });
      }
    };
    const onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, options.useGlobalTarget || isNodeOrChild(element, upEvent.target));
    };
    const onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, false);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions);
    window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  elements.forEach((element) => {
    if (!isElementKeyboardAccessible(element) && element.getAttribute("tabindex") === null) {
      element.tabIndex = 0;
    }
    const target = options.useGlobalTarget ? window : element;
    target.addEventListener("pointerdown", startPress, eventOptions);
    element.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions), eventOptions);
  });
  return cancelEvents;
}
function handlePressEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileTap) {
    node.animationState.setActive("whileTap", lifecycle === "Start");
  }
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class PressGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = press(current, (startEvent) => {
      handlePressEvent(this.node, startEvent, "Start");
      return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
    }, { useGlobalTarget: this.node.props.globalTapTarget });
  }
  unmount() {
  }
}
const observerCallbacks = /* @__PURE__ */ new WeakMap();
const observers = /* @__PURE__ */ new WeakMap();
const fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
};
const fireAllObserverCallbacks = (entries) => {
  entries.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options }) {
  const lookupRoot = root || document;
  if (!observers.has(lookupRoot)) {
    observers.set(lookupRoot, {});
  }
  const rootObservers = observers.get(lookupRoot);
  const key = JSON.stringify(options);
  if (!rootObservers[key]) {
    rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
  }
  return rootObservers[key];
}
function observeIntersection(element, options, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options);
  observerCallbacks.set(element, callback);
  rootInteresectionObserver.observe(element);
  return () => {
    observerCallbacks.delete(element);
    rootInteresectionObserver.unobserve(element);
  };
}
const thresholdNames = {
  some: 0,
  all: 1
};
class InViewFeature extends Feature {
  constructor() {
    super(...arguments);
    this.hasEnteredView = false;
    this.isInView = false;
  }
  startObserver() {
    this.unmount();
    const { viewport = {} } = this.node.getProps();
    const { root, margin: rootMargin, amount = "some", once } = viewport;
    const options = {
      root: root ? root.current : void 0,
      rootMargin,
      threshold: typeof amount === "number" ? amount : thresholdNames[amount]
    };
    const onIntersectionUpdate = (entry) => {
      const { isIntersecting } = entry;
      if (this.isInView === isIntersecting)
        return;
      this.isInView = isIntersecting;
      if (once && !isIntersecting && this.hasEnteredView) {
        return;
      } else if (isIntersecting) {
        this.hasEnteredView = true;
      }
      if (this.node.animationState) {
        this.node.animationState.setActive("whileInView", isIntersecting);
      }
      const { onViewportEnter, onViewportLeave } = this.node.getProps();
      const callback = isIntersecting ? onViewportEnter : onViewportLeave;
      callback && callback(entry);
    };
    return observeIntersection(this.node.current, options, onIntersectionUpdate);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver === "undefined")
      return;
    const { props, prevProps } = this.node;
    const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
    if (hasOptionsChanged) {
      this.startObserver();
    }
  }
  unmount() {
  }
}
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}
const gestureAnimations = {
  inView: {
    Feature: InViewFeature
  },
  tap: {
    Feature: PressGesture
  },
  focus: {
    Feature: FocusGesture
  },
  hover: {
    Feature: HoverGesture
  }
};
const layout = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
const prefersReducedMotion = { current: null };
const hasReducedMotionListener = { current: false };
function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true;
  if (!isBrowser)
    return;
  if (window.matchMedia) {
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
    const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
    motionMediaQuery.addListener(setReducedMotionPreferences);
    setReducedMotionPreferences();
  } else {
    prefersReducedMotion.current = false;
  }
}
const valueTypes = [...dimensionValueTypes, color, complex];
const findValueType = (v) => valueTypes.find(testValueType(v));
const visualElementStore = /* @__PURE__ */ new WeakMap();
function updateMotionValuesFromProps(element, next, prev) {
  for (const key in next) {
    const nextValue = next[key];
    const prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
      if (process.env.NODE_ENV === "development") {
        warnOnce(nextValue.version === "11.18.2", `Attempting to mix Motion versions ${nextValue.version} with 11.18.2 may not work as expected.`);
      }
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue, { owner: element }));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        const existingValue = element.getValue(key);
        if (existingValue.liveStyle === true) {
          existingValue.jump(nextValue);
        } else if (!existingValue.hasAnimated) {
          existingValue.set(nextValue);
        }
      } else {
        const latestValue = element.getStaticValue(key);
        element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
      }
    }
  }
  for (const key in prev) {
    if (next[key] === void 0)
      element.removeValue(key);
  }
  return next;
}
const propEventHandlers = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class VisualElement {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState }, options = {}) {
    this.current = null;
    this.children = /* @__PURE__ */ new Set();
    this.isVariantNode = false;
    this.isControllingVariants = false;
    this.shouldReduceMotion = null;
    this.values = /* @__PURE__ */ new Map();
    this.KeyframeResolver = KeyframeResolver;
    this.features = {};
    this.valueSubscriptions = /* @__PURE__ */ new Map();
    this.prevMotionValues = {};
    this.events = {};
    this.propEventSubscriptions = {};
    this.notifyUpdate = () => this.notify("Update", this.latestValues);
    this.render = () => {
      if (!this.current)
        return;
      this.triggerBuild();
      this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
    };
    this.renderScheduledAt = 0;
    this.scheduleRender = () => {
      const now2 = time.now();
      if (this.renderScheduledAt < now2) {
        this.renderScheduledAt = now2;
        frame.render(this.render, false, true);
      }
    };
    const { latestValues, renderState, onUpdate } = visualState;
    this.onUpdate = onUpdate;
    this.latestValues = latestValues;
    this.baseTarget = { ...latestValues };
    this.initialValues = props.initial ? { ...latestValues } : {};
    this.renderState = renderState;
    this.parent = parent;
    this.props = props;
    this.presenceContext = presenceContext;
    this.depth = parent ? parent.depth + 1 : 0;
    this.reducedMotionConfig = reducedMotionConfig;
    this.options = options;
    this.blockInitialAnimation = Boolean(blockInitialAnimation);
    this.isControllingVariants = isControllingVariants(props);
    this.isVariantNode = isVariantNode(props);
    if (this.isVariantNode) {
      this.variantChildren = /* @__PURE__ */ new Set();
    }
    this.manuallyAnimateOnMount = Boolean(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key in initialMotionValues) {
      const value = initialMotionValues[key];
      if (latestValues[key] !== void 0 && isMotionValue(value)) {
        value.set(latestValues[key], false);
      }
    }
  }
  mount(instance) {
    this.current = instance;
    visualElementStore.set(instance, this);
    if (this.projection && !this.projection.instance) {
      this.projection.mount(instance);
    }
    if (this.parent && this.isVariantNode && !this.isControllingVariants) {
      this.removeFromVariantTree = this.parent.addVariantChild(this);
    }
    this.values.forEach((value, key) => this.bindToMotionValue(key, value));
    if (!hasReducedMotionListener.current) {
      initPrefersReducedMotion();
    }
    this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : prefersReducedMotion.current;
    if (process.env.NODE_ENV !== "production") {
      warnOnce(this.shouldReduceMotion !== true, "You have Reduced Motion enabled on your device. Animations may not appear as expected.");
    }
    if (this.parent)
      this.parent.children.add(this);
    this.update(this.props, this.presenceContext);
  }
  unmount() {
    visualElementStore.delete(this.current);
    this.projection && this.projection.unmount();
    cancelFrame(this.notifyUpdate);
    cancelFrame(this.render);
    this.valueSubscriptions.forEach((remove) => remove());
    this.valueSubscriptions.clear();
    this.removeFromVariantTree && this.removeFromVariantTree();
    this.parent && this.parent.children.delete(this);
    for (const key in this.events) {
      this.events[key].clear();
    }
    for (const key in this.features) {
      const feature = this.features[key];
      if (feature) {
        feature.unmount();
        feature.isMounted = false;
      }
    }
    this.current = null;
  }
  bindToMotionValue(key, value) {
    if (this.valueSubscriptions.has(key)) {
      this.valueSubscriptions.get(key)();
    }
    const valueIsTransform = transformProps.has(key);
    const removeOnChange = value.on("change", (latestValue) => {
      this.latestValues[key] = latestValue;
      this.props.onUpdate && frame.preRender(this.notifyUpdate);
      if (valueIsTransform && this.projection) {
        this.projection.isTransformDirty = true;
      }
    });
    const removeOnRenderRequest = value.on("renderRequest", this.scheduleRender);
    let removeSyncCheck;
    if (window.MotionCheckAppearSync) {
      removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
    }
    this.valueSubscriptions.set(key, () => {
      removeOnChange();
      removeOnRenderRequest();
      if (removeSyncCheck)
        removeSyncCheck();
      if (value.owner)
        value.stop();
    });
  }
  sortNodePosition(other) {
    if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
      return 0;
    }
    return this.sortInstanceNodePosition(this.current, other.current);
  }
  updateFeatures() {
    let key = "animation";
    for (key in featureDefinitions) {
      const featureDefinition = featureDefinitions[key];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
        this.features[key] = new FeatureConstructor(this);
      }
      if (this.features[key]) {
        const feature = this.features[key];
        if (feature.isMounted) {
          feature.update();
        } else {
          feature.mount();
          feature.isMounted = true;
        }
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key) {
    return this.latestValues[key];
  }
  setStaticValue(key, value) {
    this.latestValues[key] = value;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props, presenceContext) {
    if (props.transformTemplate || this.props.transformTemplate) {
      this.scheduleRender();
    }
    this.prevProps = this.props;
    this.props = props;
    this.prevPresenceContext = this.presenceContext;
    this.presenceContext = presenceContext;
    for (let i = 0; i < propEventHandlers.length; i++) {
      const key = propEventHandlers[i];
      if (this.propEventSubscriptions[key]) {
        this.propEventSubscriptions[key]();
        delete this.propEventSubscriptions[key];
      }
      const listenerName = "on" + key;
      const listener = props[listenerName];
      if (listener) {
        this.propEventSubscriptions[key] = this.on(key, listener);
      }
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues);
    if (this.handleChildMotionValue) {
      this.handleChildMotionValue();
    }
    this.onUpdate && this.onUpdate(this);
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode) {
      closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
      return () => closestVariantNode.variantChildren.delete(child);
    }
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key, value) {
    const existingValue = this.values.get(key);
    if (value !== existingValue) {
      if (existingValue)
        this.removeValue(key);
      this.bindToMotionValue(key, value);
      this.values.set(key, value);
      this.latestValues[key] = value.get();
    }
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key) {
    this.values.delete(key);
    const unsubscribe = this.valueSubscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.valueSubscriptions.delete(key);
    }
    delete this.latestValues[key];
    this.removeValueFromRenderState(key, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key) {
    return this.values.has(key);
  }
  getValue(key, defaultValue) {
    if (this.props.values && this.props.values[key]) {
      return this.props.values[key];
    }
    let value = this.values.get(key);
    if (value === void 0 && defaultValue !== void 0) {
      value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
      this.addValue(key, value);
    }
    return value;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key, target) {
    var _a2;
    let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : (_a2 = this.getBaseTargetFromProps(this.props, key)) !== null && _a2 !== void 0 ? _a2 : this.readValueFromInstance(this.current, key, this.options);
    if (value !== void 0 && value !== null) {
      if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
        value = parseFloat(value);
      } else if (!findValueType(value) && complex.test(target)) {
        value = getAnimatableNone(key, target);
      }
      this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
    }
    return isMotionValue(value) ? value.get() : value;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key, value) {
    this.baseTarget[key] = value;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key) {
    var _a2;
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial === "string" || typeof initial === "object") {
      const variant = resolveVariantFromProps(this.props, initial, (_a2 = this.presenceContext) === null || _a2 === void 0 ? void 0 : _a2.custom);
      if (variant) {
        valueFromInitial = variant[key];
      }
    }
    if (initial && valueFromInitial !== void 0) {
      return valueFromInitial;
    }
    const target = this.getBaseTargetFromProps(this.props, key);
    if (target !== void 0 && !isMotionValue(target))
      return target;
    return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    return this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].notify(...args);
    }
  }
}
class DOMVisualElement extends VisualElement {
  constructor() {
    super(...arguments);
    this.KeyframeResolver = DOMKeyframesResolver;
  }
  sortInstanceNodePosition(a, b) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(props, key) {
    return props.style ? props.style[key] : void 0;
  }
  removeValueFromRenderState(key, { vars, style }) {
    delete vars[key];
    delete style[key];
  }
  handleChildMotionValue() {
    if (this.childSubscription) {
      this.childSubscription();
      delete this.childSubscription;
    }
    const { children } = this.props;
    if (isMotionValue(children)) {
      this.childSubscription = children.on("change", (latest) => {
        if (this.current) {
          this.current.textContent = `${latest}`;
        }
      });
    }
  }
}
function getComputedStyle$1(element) {
  return window.getComputedStyle(element);
}
class HTMLVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "html";
    this.renderInstance = renderHTML;
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    } else {
      const computedStyle = getComputedStyle$1(instance);
      const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
      return typeof value === "string" ? value.trim() : value;
    }
  }
  measureInstanceViewportBox(instance, { transformPagePoint }) {
    return measureViewportBox(instance, transformPagePoint);
  }
  build(renderState, latestValues, props) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  }
}
class SVGVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "svg";
    this.isSVGTag = false;
    this.measureInstanceViewportBox = createBox;
  }
  getBaseTargetFromProps(props, key) {
    return props[key];
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    }
    key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
    return instance.getAttribute(key);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }
  build(renderState, latestValues, props) {
    buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate);
  }
  renderInstance(instance, renderState, styleProp, projection) {
    renderSVG(instance, renderState, styleProp, projection);
  }
  mount(instance) {
    this.isSVGTag = isSVGTag(instance.tagName);
    super.mount(instance);
  }
}
const createDomVisualElement = (Component2, options) => {
  return isSVGComponent(Component2) ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
    allowProjection: Component2 !== Fragment$1
  });
};
const createMotionComponent = /* @__PURE__ */ createMotionComponentFactory({
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layout
}, createDomVisualElement);
const motion = /* @__PURE__ */ createDOMMotionComponentProxy(createMotionComponent);
function observeTimeline(update, timeline) {
  let prevProgress;
  const onFrame = () => {
    const { currentTime } = timeline;
    const percentage = currentTime === null ? 0 : currentTime.value;
    const progress2 = percentage / 100;
    if (prevProgress !== progress2) {
      update(progress2);
    }
    prevProgress = progress2;
  };
  frame.update(onFrame, true);
  return () => cancelFrame(onFrame);
}
const resizeHandlers = /* @__PURE__ */ new WeakMap();
let observer;
function getElementSize(target, borderBoxSize) {
  if (borderBoxSize) {
    const { inlineSize, blockSize } = borderBoxSize[0];
    return { width: inlineSize, height: blockSize };
  } else if (target instanceof SVGElement && "getBBox" in target) {
    return target.getBBox();
  } else {
    return {
      width: target.offsetWidth,
      height: target.offsetHeight
    };
  }
}
function notifyTarget({ target, contentRect, borderBoxSize }) {
  var _a2;
  (_a2 = resizeHandlers.get(target)) === null || _a2 === void 0 ? void 0 : _a2.forEach((handler) => {
    handler({
      target,
      contentSize: contentRect,
      get size() {
        return getElementSize(target, borderBoxSize);
      }
    });
  });
}
function notifyAll(entries) {
  entries.forEach(notifyTarget);
}
function createResizeObserver() {
  if (typeof ResizeObserver === "undefined")
    return;
  observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
  if (!observer)
    createResizeObserver();
  const elements = resolveElements(target);
  elements.forEach((element) => {
    let elementHandlers = resizeHandlers.get(element);
    if (!elementHandlers) {
      elementHandlers = /* @__PURE__ */ new Set();
      resizeHandlers.set(element, elementHandlers);
    }
    elementHandlers.add(handler);
    observer === null || observer === void 0 ? void 0 : observer.observe(element);
  });
  return () => {
    elements.forEach((element) => {
      const elementHandlers = resizeHandlers.get(element);
      elementHandlers === null || elementHandlers === void 0 ? void 0 : elementHandlers.delete(handler);
      if (!(elementHandlers === null || elementHandlers === void 0 ? void 0 : elementHandlers.size)) {
        observer === null || observer === void 0 ? void 0 : observer.unobserve(element);
      }
    });
  };
}
const windowCallbacks = /* @__PURE__ */ new Set();
let windowResizeHandler;
function createWindowResizeHandler() {
  windowResizeHandler = () => {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    const info = {
      target: window,
      size,
      contentSize: size
    };
    windowCallbacks.forEach((callback) => callback(info));
  };
  window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
  windowCallbacks.add(callback);
  if (!windowResizeHandler)
    createWindowResizeHandler();
  return () => {
    windowCallbacks.delete(callback);
    if (!windowCallbacks.size && windowResizeHandler) {
      windowResizeHandler = void 0;
    }
  };
}
function resize(a, b) {
  return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
}
const maxElapsed = 50;
const createAxisInfo = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0
});
const createScrollInfo = () => ({
  time: 0,
  x: createAxisInfo(),
  y: createAxisInfo()
});
const keys = {
  x: {
    length: "Width",
    position: "Left"
  },
  y: {
    length: "Height",
    position: "Top"
  }
};
function updateAxisInfo(element, axisName, info, time2) {
  const axis = info[axisName];
  const { length, position } = keys[axisName];
  const prev = axis.current;
  const prevTime = info.time;
  axis.current = element[`scroll${position}`];
  axis.scrollLength = element[`scroll${length}`] - element[`client${length}`];
  axis.offset.length = 0;
  axis.offset[0] = 0;
  axis.offset[1] = axis.scrollLength;
  axis.progress = /* @__PURE__ */ progress(0, axis.scrollLength, axis.current);
  const elapsed = time2 - prevTime;
  axis.velocity = elapsed > maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed);
}
function updateScrollInfo(element, info, time2) {
  updateAxisInfo(element, "x", info, time2);
  updateAxisInfo(element, "y", info, time2);
  info.time = time2;
}
function calcInset(element, container) {
  const inset = { x: 0, y: 0 };
  let current = element;
  while (current && current !== container) {
    if (current instanceof HTMLElement) {
      inset.x += current.offsetLeft;
      inset.y += current.offsetTop;
      current = current.offsetParent;
    } else if (current.tagName === "svg") {
      const svgBoundingBox = current.getBoundingClientRect();
      current = current.parentElement;
      const parentBoundingBox = current.getBoundingClientRect();
      inset.x += svgBoundingBox.left - parentBoundingBox.left;
      inset.y += svgBoundingBox.top - parentBoundingBox.top;
    } else if (current instanceof SVGGraphicsElement) {
      const { x, y } = current.getBBox();
      inset.x += x;
      inset.y += y;
      let svg = null;
      let parent = current.parentNode;
      while (!svg) {
        if (parent.tagName === "svg") {
          svg = parent;
        }
        parent = current.parentNode;
      }
      current = svg;
    } else {
      break;
    }
  }
  return inset;
}
const namedEdges = {
  start: 0,
  center: 0.5,
  end: 1
};
function resolveEdge(edge, length, inset = 0) {
  let delta = 0;
  if (edge in namedEdges) {
    edge = namedEdges[edge];
  }
  if (typeof edge === "string") {
    const asNumber2 = parseFloat(edge);
    if (edge.endsWith("px")) {
      delta = asNumber2;
    } else if (edge.endsWith("%")) {
      edge = asNumber2 / 100;
    } else if (edge.endsWith("vw")) {
      delta = asNumber2 / 100 * document.documentElement.clientWidth;
    } else if (edge.endsWith("vh")) {
      delta = asNumber2 / 100 * document.documentElement.clientHeight;
    } else {
      edge = asNumber2;
    }
  }
  if (typeof edge === "number") {
    delta = length * edge;
  }
  return inset + delta;
}
const defaultOffset = [0, 0];
function resolveOffset(offset, containerLength, targetLength, targetInset) {
  let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset;
  let targetPoint = 0;
  let containerPoint = 0;
  if (typeof offset === "number") {
    offsetDefinition = [offset, offset];
  } else if (typeof offset === "string") {
    offset = offset.trim();
    if (offset.includes(" ")) {
      offsetDefinition = offset.split(" ");
    } else {
      offsetDefinition = [offset, namedEdges[offset] ? offset : `0`];
    }
  }
  targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
  containerPoint = resolveEdge(offsetDefinition[1], containerLength);
  return targetPoint - containerPoint;
}
const ScrollOffset = {
  All: [
    [0, 0],
    [1, 1]
  ]
};
const point = { x: 0, y: 0 };
function getTargetSize(target) {
  return "getBBox" in target && target.tagName !== "svg" ? target.getBBox() : { width: target.clientWidth, height: target.clientHeight };
}
function resolveOffsets(container, info, options) {
  const { offset: offsetDefinition = ScrollOffset.All } = options;
  const { target = container, axis = "y" } = options;
  const lengthLabel = axis === "y" ? "height" : "width";
  const inset = target !== container ? calcInset(target, container) : point;
  const targetSize = target === container ? { width: container.scrollWidth, height: container.scrollHeight } : getTargetSize(target);
  const containerSize = {
    width: container.clientWidth,
    height: container.clientHeight
  };
  info[axis].offset.length = 0;
  let hasChanged = !info[axis].interpolate;
  const numOffsets = offsetDefinition.length;
  for (let i = 0; i < numOffsets; i++) {
    const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
    if (!hasChanged && offset !== info[axis].interpolatorOffsets[i]) {
      hasChanged = true;
    }
    info[axis].offset[i] = offset;
  }
  if (hasChanged) {
    info[axis].interpolate = interpolate(info[axis].offset, defaultOffset$1(offsetDefinition), { clamp: false });
    info[axis].interpolatorOffsets = [...info[axis].offset];
  }
  info[axis].progress = clamp(0, 1, info[axis].interpolate(info[axis].current));
}
function measure(container, target = container, info) {
  info.x.targetOffset = 0;
  info.y.targetOffset = 0;
  if (target !== container) {
    let node = target;
    while (node && node !== container) {
      info.x.targetOffset += node.offsetLeft;
      info.y.targetOffset += node.offsetTop;
      node = node.offsetParent;
    }
  }
  info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
  info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
  info.x.containerLength = container.clientWidth;
  info.y.containerLength = container.clientHeight;
  if (process.env.NODE_ENV !== "production") {
    if (container && target && target !== container) {
      warnOnce(getComputedStyle(container).position !== "static", "Please ensure that the container has a non-static position, like 'relative', 'fixed', or 'absolute' to ensure scroll offset is calculated correctly.");
    }
  }
}
function createOnScrollHandler(element, onScroll, info, options = {}) {
  return {
    measure: () => measure(element, options.target, info),
    update: (time2) => {
      updateScrollInfo(element, info, time2);
      if (options.offset || options.target) {
        resolveOffsets(element, info, options);
      }
    },
    notify: () => onScroll(info)
  };
}
const scrollListeners = /* @__PURE__ */ new WeakMap();
const resizeListeners = /* @__PURE__ */ new WeakMap();
const onScrollHandlers = /* @__PURE__ */ new WeakMap();
const getEventTarget = (element) => element === document.documentElement ? window : element;
function scrollInfo(onScroll, { container = document.documentElement, ...options } = {}) {
  let containerHandlers = onScrollHandlers.get(container);
  if (!containerHandlers) {
    containerHandlers = /* @__PURE__ */ new Set();
    onScrollHandlers.set(container, containerHandlers);
  }
  const info = createScrollInfo();
  const containerHandler = createOnScrollHandler(container, onScroll, info, options);
  containerHandlers.add(containerHandler);
  if (!scrollListeners.has(container)) {
    const measureAll = () => {
      for (const handler of containerHandlers)
        handler.measure();
    };
    const updateAll = () => {
      for (const handler of containerHandlers) {
        handler.update(frameData.timestamp);
      }
    };
    const notifyAll2 = () => {
      for (const handler of containerHandlers)
        handler.notify();
    };
    const listener2 = () => {
      frame.read(measureAll, false, true);
      frame.read(updateAll, false, true);
      frame.update(notifyAll2, false, true);
    };
    scrollListeners.set(container, listener2);
    const target = getEventTarget(container);
    window.addEventListener("resize", listener2, { passive: true });
    if (container !== document.documentElement) {
      resizeListeners.set(container, resize(container, listener2));
    }
    target.addEventListener("scroll", listener2, { passive: true });
  }
  const listener = scrollListeners.get(container);
  frame.read(listener, false, true);
  return () => {
    var _a2;
    cancelFrame(listener);
    const currentHandlers = onScrollHandlers.get(container);
    if (!currentHandlers)
      return;
    currentHandlers.delete(containerHandler);
    if (currentHandlers.size)
      return;
    const scrollListener = scrollListeners.get(container);
    scrollListeners.delete(container);
    if (scrollListener) {
      getEventTarget(container).removeEventListener("scroll", scrollListener);
      (_a2 = resizeListeners.get(container)) === null || _a2 === void 0 ? void 0 : _a2();
      window.removeEventListener("resize", scrollListener);
    }
  };
}
function scrollTimelineFallback({ source, container, axis = "y" }) {
  if (source)
    container = source;
  const currentTime = { value: 0 };
  const cancel = scrollInfo((info) => {
    currentTime.value = info[axis].progress * 100;
  }, { container, axis });
  return { currentTime, cancel };
}
const timelineCache = /* @__PURE__ */ new Map();
function getTimeline({ source, container = document.documentElement, axis = "y" } = {}) {
  if (source)
    container = source;
  if (!timelineCache.has(container)) {
    timelineCache.set(container, {});
  }
  const elementCache = timelineCache.get(container);
  if (!elementCache[axis]) {
    elementCache[axis] = supportsScrollTimeline() ? new ScrollTimeline({ source: container, axis }) : scrollTimelineFallback({ source: container, axis });
  }
  return elementCache[axis];
}
function isOnScrollWithInfo(onScroll) {
  return onScroll.length === 2;
}
function needsElementTracking(options) {
  return options && (options.target || options.offset);
}
function scrollFunction(onScroll, options) {
  if (isOnScrollWithInfo(onScroll) || needsElementTracking(options)) {
    return scrollInfo((info) => {
      onScroll(info[options.axis].progress, info);
    }, options);
  } else {
    return observeTimeline(onScroll, getTimeline(options));
  }
}
function scrollAnimation(animation, options) {
  animation.flatten();
  if (needsElementTracking(options)) {
    animation.pause();
    return scrollInfo((info) => {
      animation.time = animation.duration * info[options.axis].progress;
    }, options);
  } else {
    const timeline = getTimeline(options);
    if (animation.attachTimeline) {
      return animation.attachTimeline(timeline, (valueAnimation) => {
        valueAnimation.pause();
        return observeTimeline((progress2) => {
          valueAnimation.time = valueAnimation.duration * progress2;
        }, timeline);
      });
    } else {
      return noop;
    }
  }
}
function scroll(onScroll, { axis = "y", ...options } = {}) {
  const optionsWithDefaults = { axis, ...options };
  return typeof onScroll === "function" ? scrollFunction(onScroll, optionsWithDefaults) : scrollAnimation(onScroll, optionsWithDefaults);
}
function refWarning(name, ref) {
  warning(Boolean(!ref || ref.current), `You have defined a ${name} options but the provided ref is not yet hydrated, probably because it's defined higher up the tree. Try calling useScroll() in the same component as the ref, or setting its \`layoutEffect: false\` option.`);
}
const createScrollMotionValues = () => ({
  scrollX: motionValue(0),
  scrollY: motionValue(0),
  scrollXProgress: motionValue(0),
  scrollYProgress: motionValue(0)
});
function useScroll({ container, target, layoutEffect = true, ...options } = {}) {
  const values = useConstant(createScrollMotionValues);
  const useLifecycleEffect = layoutEffect ? useIsomorphicLayoutEffect : useEffect;
  useLifecycleEffect(() => {
    refWarning("target", target);
    refWarning("container", container);
    return scroll((_progress, { x, y }) => {
      values.scrollX.set(x.current);
      values.scrollXProgress.set(x.progress);
      values.scrollY.set(y.current);
      values.scrollYProgress.set(y.progress);
    }, {
      ...options,
      container: (container === null || container === void 0 ? void 0 : container.current) || void 0,
      target: (target === null || target === void 0 ? void 0 : target.current) || void 0
    });
  }, [container, target, JSON.stringify(options.offset)]);
  return values;
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = useState(initial);
    useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
const isCustomValueType = (v) => {
  return v && typeof v === "object" && v.mix;
};
const getMixer = (v) => isCustomValueType(v) ? v.mix : void 0;
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, {
    mixer: getMixer(outputRange[0]),
    ...options
  });
  return useImmediate ? interpolator(inputValue) : interpolator;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRange, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRange, options);
  return Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
const SEPARATORS = /\s*[\/,&]\s*/;
function parseGenreTags(raw) {
  if (!raw) return [];
  return raw.split(SEPARATORS).map((s) => s.trim()).filter((s) => s.length > 0);
}
function FavoriteButton({
  kind,
  targetId,
  label,
  size = "md",
  variant = "icon",
  className = "",
  promptLoginOnAnon = false
}) {
  const { user } = useSession();
  const { has, toggle } = useFavorites();
  const navigate = useNavigate();
  const active = !!user && has(kind, targetId);
  const iconSize = size === "sm" ? 12 : 14;
  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      if (promptLoginOnAnon) navigate(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    await toggle(kind, targetId, label);
  }
  const title = active ? "Quitar de favoritos" : "Añadir a favoritos";
  if (variant === "pill") {
    const verb = active ? "Siguiendo" : "Seguir";
    const noun = kind === "concert" ? "concierto" : kind === "artist" ? "artista" : "ciudad";
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: handleClick,
        "aria-pressed": active,
        "aria-label": title,
        title,
        className: `inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border-2 px-3 py-1.5 transition-colors ${active ? "border-cr-secondary text-cr-secondary bg-cr-secondary/10" : "border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"} ${className}`,
        children: [
          /* @__PURE__ */ jsx(Heart, { size: iconSize, fill: active ? "currentColor" : "none", strokeWidth: 2 }),
          verb,
          " ",
          noun
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: handleClick,
      "aria-pressed": active,
      "aria-label": title,
      title,
      className: `inline-flex items-center justify-center w-8 h-8 border transition-colors ${active ? "border-cr-secondary bg-cr-secondary/15 text-cr-secondary" : "border-cr-border bg-cr-bg/80 text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"} ${className}`,
      children: /* @__PURE__ */ jsx(Heart, { size: iconSize, fill: active ? "currentColor" : "none", strokeWidth: 2 })
    }
  );
}
const FAMILY_HUE = {
  rock: 10,
  // red-orange
  indie: 295,
  // pink-purple
  electronic: 195,
  // cyan-blue
  urban: 45,
  // yellow-amber
  jazz: 165,
  // teal-green
  default: 245
  // blue-violet
};
function genreFamily(genre) {
  if (!genre) return "default";
  const g = genre.toLowerCase();
  if (/(metal|punk|hardcore|rock)/.test(g)) return "rock";
  if (/(electr|edm|techno|house|trance)/.test(g)) return "electronic";
  if (/(urban|reggaet|trap|hip-?hop)/.test(g)) return "urban";
  if (/(jazz|world|mestizaje|celta|flamenco)/.test(g)) return "jazz";
  if (/(indie|pop)/.test(g)) return "indie";
  return "default";
}
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return Math.abs(h);
}
function posterHue(artist, genre) {
  const base = FAMILY_HUE[genreFamily(genre)];
  const offset = hashStr(artist) % 50 - 25;
  return (base + offset + 360) % 360;
}
function initialsFor(artist) {
  var _a2;
  const words = artist.trim().split(/\s+/);
  if (words[0] && /^[A-Z]{2,4}$/.test(words[0])) return words[0];
  const noise = /^(festival|fest|de|del|do|da|la|el|los|las|un|una|the|of)$/i;
  const meaningful = words.filter((w) => w && !noise.test(w));
  const letters = meaningful.slice(0, 3).map((w) => {
    var _a3;
    return ((_a3 = w[0]) == null ? void 0 : _a3.toUpperCase()) ?? "";
  }).join("");
  return letters || ((_a2 = artist[0]) == null ? void 0 : _a2.toUpperCase()) || "?";
}
function isFestival(genre) {
  return !!genre && /festival/i.test(genre);
}
function ConcertPoster({ concert, className = "" }) {
  const hue = posterHue(concert.artist, concert.genre);
  const family = genreFamily(concert.genre);
  const initials2 = initialsFor(concert.artist);
  const festival = isFestival(concert.genre);
  const uid = concert.id.replace(/[^a-z0-9]/gi, "");
  const initialsSize = initials2.length === 1 ? 220 : initials2.length === 2 ? 160 : 110;
  const initialsX = initials2.length === 1 ? 200 : 28;
  const initialsAnchor = initials2.length === 1 ? "middle" : "start";
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 400 300",
      preserveAspectRatio: "xMidYMid slice",
      className: `absolute inset-0 w-full h-full ${className}`,
      role: "img",
      "aria-label": `Cartel para ${concert.artist}`,
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: `bg-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: `hsl(${hue}, 70%, 28%)` }),
            /* @__PURE__ */ jsx("stop", { offset: "55%", stopColor: `hsl(${(hue + 18) % 360}, 55%, 16%)` }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#080808" })
          ] }),
          /* @__PURE__ */ jsxs("radialGradient", { id: `glow-${uid}`, cx: "22%", cy: "28%", r: "55%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: `hsl(${hue}, 95%, 60%)`, stopOpacity: "0.42" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "transparent" })
          ] }),
          /* @__PURE__ */ jsxs("radialGradient", { id: `shadow-${uid}`, cx: "50%", cy: "100%", r: "80%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#000", stopOpacity: "0.55" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "transparent" })
          ] }),
          family === "rock" && /* @__PURE__ */ jsxs("pattern", { id: `pat-${uid}`, x: "0", y: "0", width: "22", height: "22", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)", children: [
            /* @__PURE__ */ jsx("rect", { width: "22", height: "22", fill: "transparent" }),
            /* @__PURE__ */ jsx("line", { x1: "0", y1: "0", x2: "0", y2: "22", stroke: "#fff", strokeWidth: "1", opacity: "0.06" })
          ] }),
          family === "electronic" && /* @__PURE__ */ jsx("pattern", { id: `pat-${uid}`, x: "0", y: "0", width: "14", height: "14", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "1", fill: "#fff", opacity: "0.1" }) }),
          family === "urban" && /* @__PURE__ */ jsx("pattern", { id: `pat-${uid}`, x: "0", y: "0", width: "48", height: "48", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("circle", { cx: "24", cy: "24", r: "14", stroke: "#fff", strokeWidth: "1.5", fill: "none", opacity: "0.07" }) }),
          family === "jazz" && /* @__PURE__ */ jsx("pattern", { id: `pat-${uid}`, x: "0", y: "0", width: "60", height: "20", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("path", { d: "M0 10 Q15 0 30 10 T60 10", stroke: "#fff", strokeWidth: "1", fill: "none", opacity: "0.07" }) }),
          family === "indie" && /* @__PURE__ */ jsx("pattern", { id: `pat-${uid}`, x: "0", y: "0", width: "36", height: "36", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("circle", { cx: "18", cy: "18", r: "2", fill: "#fff", opacity: "0.06" }) }),
          family === "default" && /* @__PURE__ */ jsxs("pattern", { id: `pat-${uid}`, x: "0", y: "0", width: "30", height: "30", patternUnits: "userSpaceOnUse", children: [
            /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "1", height: "30", fill: "#fff", opacity: "0.04" }),
            /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "30", height: "1", fill: "#fff", opacity: "0.04" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("rect", { width: "400", height: "300", fill: `url(#bg-${uid})` }),
        /* @__PURE__ */ jsx("rect", { width: "400", height: "300", fill: `url(#glow-${uid})` }),
        /* @__PURE__ */ jsx("rect", { width: "400", height: "300", fill: `url(#pat-${uid})` }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: initialsX,
            y: "200",
            fill: "#FFFFFF",
            opacity: "0.92",
            fontFamily: "'Archivo Black', 'Inter', sans-serif",
            fontWeight: "900",
            fontSize: initialsSize,
            letterSpacing: "-6",
            textAnchor: initialsAnchor,
            dominantBaseline: "middle",
            children: initials2
          }
        ),
        /* @__PURE__ */ jsx(
          "rect",
          {
            x: 28 + hashStr(concert.id) % 8 * 30,
            y: "0",
            width: "3",
            height: "30",
            fill: "#DBFF00"
          }
        ),
        /* @__PURE__ */ jsx("rect", { x: "20", y: "22", width: festival ? 78 : 90, height: "20", fill: "#DBFF00" }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: 20 + (festival ? 78 : 90) / 2,
            y: "32",
            fill: "#000",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "700",
            fontSize: "10",
            letterSpacing: "2",
            textAnchor: "middle",
            dominantBaseline: "middle",
            children: festival ? "FESTIVAL" : "CONCIERTO"
          }
        ),
        /* @__PURE__ */ jsx("rect", { width: "400", height: "300", fill: `url(#shadow-${uid})` }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "380",
            y: "284",
            fill: "#FFFFFF",
            opacity: "0.45",
            textAnchor: "end",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11",
            letterSpacing: "1",
            children: concert.venue.city.toUpperCase()
          }
        )
      ]
    }
  );
}
const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1e3;
function concertStatus(date) {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 0) return "upcoming";
  if (diff < THREE_WEEKS_MS) return "passed";
  return "archived";
}
function ConcertCard({ concert, className = "", onClick }) {
  const status = concertStatus(concert.date);
  const tags = parseGenreTags(concert.genre).slice(0, 2);
  const ridesCount = concert.active_rides_count;
  const hasRides = ridesCount > 0;
  return /* @__PURE__ */ jsxs(
    motion.article,
    {
      whileHover: { y: -4, transition: { duration: 0.15 } },
      "aria-label": `${concert.artist} en ${concert.venue.name}, ${formatDay(concert.date)}`,
      onClick,
      className: `group relative overflow-hidden bg-cr-surface border border-cr-border hover:border-cr-primary/40 transition-colors cursor-pointer ${status !== "upcoming" ? "opacity-60" : ""} ${className}`,
      children: [
        status === "passed" && /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 z-10 bg-cr-secondary/90 text-white font-mono text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]", children: "PASSED" }),
        status === "upcoming" && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 z-10", children: /* @__PURE__ */ jsx(
          FavoriteButton,
          {
            kind: "concert",
            targetId: concert.id,
            label: `${concert.artist} — ${concert.venue.city}`,
            size: "sm"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "aspect-[4/3] relative overflow-hidden", children: [
          concert.image_url ? /* @__PURE__ */ jsx(
            "img",
            {
              src: concert.image_url,
              alt: `${concert.artist} — ${concert.venue.name}, ${concert.venue.city}`,
              loading: "lazy",
              className: "absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            }
          ) : /* @__PURE__ */ jsx(ConcertPoster, { concert, className: "transition-transform duration-300 group-hover:scale-[1.02]" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-cr-bg via-cr-bg/40 to-transparent" }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 p-4 space-y-1.5", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl md:text-2xl uppercase leading-[1.05] line-clamp-2", children: concert.artist }),
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-xs text-cr-text-muted line-clamp-1", children: [
              concert.venue.name,
              " · ",
              formatDay(concert.date)
            ] })
          ] })
        ] }),
        tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 px-3 pt-3", children: tags.map((t) => /* @__PURE__ */ jsx(
          "span",
          {
            className: "font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-muted border border-cr-border px-1.5 py-0.5",
            children: t
          },
          t
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 border-t border-cr-border mt-3", children: [
          /* @__PURE__ */ jsx("span", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted", children: concert.venue.city }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            (concert.demand_count ?? 0) > 0 && /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] text-cr-secondary", title: "Personas buscando viaje", children: [
              concert.demand_count,
              " demanda"
            ] }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `font-mono text-xs ${hasRides ? "text-cr-primary" : "text-cr-text-muted"}`,
                title: hasRides ? "Viajes publicados" : "Nadie ha publicado viaje todavía",
                children: hasRides ? `${ridesCount} viaje${ridesCount === 1 ? "" : "s"}` : "Sin viajes"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const TICKETS = [
  {
    id: "rosalia",
    artist: "ROSALÍA",
    tour: "LUX TOUR · 2026",
    venue: "WiZink Center · Madrid",
    date: "JUE 22 MAY · 21:00 CEST",
    from: "VALENCIA",
    to: "MADRID",
    price: 18,
    seats: 3,
    driverInitial: "L",
    driverName: "Laura M.",
    rating: 4.9,
    ridCode: "RID-2026-VAL-MAD",
    ticketNum: "#CR-00842"
  },
  {
    id: "badbunny",
    artist: "BAD BUNNY",
    tour: "MOST WANTED · 2026",
    venue: "Estadio La Cartuja · Sevilla",
    date: "LUN 8 JUN · 22:00 CEST",
    from: "CÓRDOBA",
    to: "SEVILLA",
    price: 22,
    seats: 2,
    driverInitial: "D",
    driverName: "Dani R.",
    rating: 4.8,
    ridCode: "RID-2026-COR-SEV",
    ticketNum: "#CR-00921"
  },
  {
    id: "madcool",
    artist: "MAD COOL",
    tour: "FESTIVAL · DAY 1",
    venue: "IFEMA · Madrid",
    date: "JUE 9 JUL · 16:00 CEST",
    from: "BILBAO",
    to: "MADRID",
    price: 35,
    seats: 4,
    driverInitial: "I",
    driverName: "Irene S.",
    rating: 4.9,
    ridCode: "RID-2026-BIL-MAD",
    ticketNum: "#CR-01034"
  },
  {
    id: "primavera",
    artist: "PRIMAVERA",
    tour: "SOUND 2026 · FRI",
    venue: "Parc del Fòrum · Barcelona",
    date: "VIE 5 JUN · 18:00 CEST",
    from: "ZARAGOZA",
    to: "BARCELONA",
    price: 28,
    seats: 3,
    driverInitial: "J",
    driverName: "Jorge B.",
    rating: 4.7,
    ridCode: "RID-2026-ZGZ-BCN",
    ticketNum: "#CR-00887"
  },
  {
    id: "quevedo",
    artist: "QUEVEDO",
    tour: "BUENAS NOCHES TOUR",
    venue: "Bilbao Arena · Bilbao",
    date: "MIE 29 ABR · 21:30 CEST",
    from: "VITORIA",
    to: "BILBAO",
    price: 12,
    seats: 1,
    driverInitial: "P",
    driverName: "Paula G.",
    rating: 5,
    ridCode: "RID-2026-VIT-BIL",
    ticketNum: "#CR-00763"
  }
];
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
function Hero() {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const stubY = useTransform(scrollY, [0, 600], [0, 160]);
  const reducedMotion = usePrefersReducedMotion();
  const [ticketIdx, setTicketIdx] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id2 = setInterval(() => {
      setTicketIdx((i) => (i + 1) % TICKETS.length);
    }, 6e3);
    return () => clearInterval(id2);
  }, [reducedMotion]);
  const currentTicket = TICKETS[ticketIdx];
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": "hero-title",
      className: "relative min-h-dvh flex items-center overflow-hidden bg-cr-bg",
      children: [
        /* @__PURE__ */ jsx(NoiseOverlay, {}),
        /* @__PURE__ */ jsx(CornerTicks, {}),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            "aria-hidden": "true",
            style: { y: stubY },
            className: "absolute top-[10%] right-[-50px] md:right-[5%] w-[260px] md:w-[380px] rotate-[8deg] pointer-events-none opacity-80 md:opacity-100",
            children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20, scale: 0.96 },
                animate: { opacity: 1, y: 0, scale: 1 },
                exit: { opacity: 0, y: -20, scale: 0.96 },
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                children: /* @__PURE__ */ jsx(TicketStub, { ticket: currentTicket })
              },
              currentTicket.id
            ) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 space-y-10", children: [
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: 0.05 },
              className: "font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-cr-primary",
              children: "ConcertRide · España · Temporada 2026"
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.h1,
            {
              id: "hero-title",
              initial: { opacity: 0, y: 40 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              className: "font-display uppercase leading-[0.88] tracking-tight text-[56px] sm:text-[88px] md:text-[120px] lg:text-[144px]",
              children: [
                "Al concierto",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-cr-primary", children: "juntos." })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.p,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, delay: 0.15 },
              className: "font-sans text-base md:text-xl text-cr-text-muted max-w-xl leading-relaxed",
              children: [
                "Comparte el viaje. Divide el coste. Llega al show.",
                /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
                "La plataforma de viajes compartidos a conciertos en España."
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, delay: 0.25 },
              className: "flex flex-col sm:flex-row gap-3",
              children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/concerts",
                    className: "inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100",
                    children: "Buscar un viaje"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/publish",
                    className: "inline-flex items-center justify-center bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-6 py-4 transition-colors duration-150",
                    children: "Ofrecer mi coche"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.5, delay: 0.4 },
              className: "font-mono text-xs text-cr-text-muted"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            style: { opacity: indicatorOpacity },
            "aria-hidden": "true",
            className: "absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-cr-text-dim",
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.24em]", children: "Scroll" }),
              /* @__PURE__ */ jsx(ChevronDown, { size: 16, className: "animate-bounce" })
            ]
          }
        )
      ]
    }
  );
}
function NoiseOverlay() {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": "true",
      className: "absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen",
      style: {
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`
      }
    }
  );
}
function CornerTicks() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-6 left-6 w-6 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-6 left-6 w-px h-6 bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-6 right-6 w-6 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-6 right-6 w-px h-6 bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-6 left-6 w-6 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-6 left-6 w-px h-6 bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-6 right-6 w-6 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-6 right-6 w-px h-6 bg-cr-primary" })
  ] });
}
function barcodeFor(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) | 0;
  const out = [];
  for (let i = 0; i < 24; i++) {
    h = h * 1103515245 + 12345 | 0;
    out.push((Math.abs(h) >> i % 8) % 4 + 1);
  }
  return out;
}
function TicketStub({ ticket }) {
  const barcode = barcodeFor(ticket.id);
  const artistFontSize = ticket.artist.length > 9 ? 30 : ticket.artist.length > 7 ? 36 : 40;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 380 260",
      className: "w-full h-auto drop-shadow-[0_0_50px_rgba(219,255,0,0.35)]",
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "stubGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#0E0E0E" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#1A1A1A" })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: "voltShine", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#DBFF00", stopOpacity: "1" }),
            /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "#FFFFFF", stopOpacity: "1" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#DBFF00", stopOpacity: "1" })
          ] }),
          /* @__PURE__ */ jsxs("radialGradient", { id: "artistGlow", cx: "50%", cy: "50%", r: "60%", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#DBFF00", stopOpacity: "0.18" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#DBFF00", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsx("clipPath", { id: "priceClip", children: /* @__PURE__ */ jsx("rect", { x: "270", y: "60", width: "100", height: "120" }) })
        ] }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "380", height: "260", fill: "url(#stubGrad)", stroke: "#2A2A2A", strokeWidth: "1" }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "380", height: "3", fill: "#DBFF00" }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "3", height: "260", fill: "#DBFF00", opacity: "0.6" }),
        /* @__PURE__ */ jsx("ellipse", { cx: "140", cy: "110", rx: "130", ry: "50", fill: "url(#artistGlow)" }),
        /* @__PURE__ */ jsx("rect", { x: "14", y: "18", width: "6", height: "6", fill: "#DBFF00" }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "28",
            y: "24",
            fill: "#DBFF00",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "700",
            fontSize: "9",
            letterSpacing: "2",
            dominantBaseline: "middle",
            children: "CONCERTRIDE · BOARDING PASS"
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "360",
            y: "24",
            fill: "#888",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8",
            textAnchor: "end",
            dominantBaseline: "middle",
            children: ticket.ticketNum
          }
        ),
        /* @__PURE__ */ jsx("circle", { cx: "26", cy: "52", r: "4", fill: "#DBFF00", children: /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "1;0.25;1", dur: "1.4s", repeatCount: "indefinite" }) }),
        /* @__PURE__ */ jsxs("circle", { cx: "26", cy: "52", r: "4", fill: "none", stroke: "#DBFF00", strokeWidth: "1", children: [
          /* @__PURE__ */ jsx("animate", { attributeName: "r", values: "4;10;4", dur: "1.4s", repeatCount: "indefinite" }),
          /* @__PURE__ */ jsx("animate", { attributeName: "opacity", values: "0.8;0;0.8", dur: "1.4s", repeatCount: "indefinite" })
        ] }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "38",
            y: "52",
            fill: "#F5F5F5",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "700",
            fontSize: "9",
            letterSpacing: "1.6",
            dominantBaseline: "middle",
            children: "CARPOOLING · CONCIERTOS · FESTIVALES"
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "24",
            y: "108",
            fill: "#DBFF00",
            fontFamily: "'Archivo Black', 'Inter', sans-serif",
            fontWeight: "900",
            fontSize: artistFontSize,
            letterSpacing: "-1.5",
            opacity: "0.18",
            children: ticket.artist
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "22",
            y: "106",
            fill: "#F5F5F5",
            fontFamily: "'Archivo Black', 'Inter', sans-serif",
            fontWeight: "900",
            fontSize: artistFontSize,
            letterSpacing: "-1.5",
            children: ticket.artist
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "24",
            y: "128",
            fill: "#DBFF00",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "600",
            fontSize: "11",
            letterSpacing: "2.5",
            children: ticket.tour
          }
        ),
        /* @__PURE__ */ jsx("rect", { x: "24", y: "142", width: "220", height: "1", fill: "#2A2A2A" }),
        /* @__PURE__ */ jsx("circle", { cx: "27", cy: "159", r: "2", fill: "#DBFF00" }),
        /* @__PURE__ */ jsx("text", { x: "34", y: "162", fill: "#F5F5F5", fontFamily: "'JetBrains Mono', monospace", fontSize: "11", children: ticket.venue }),
        /* @__PURE__ */ jsx("circle", { cx: "27", cy: "179", r: "2", fill: "#DBFF00" }),
        /* @__PURE__ */ jsx("text", { x: "34", y: "182", fill: "#F5F5F5", fontFamily: "'JetBrains Mono', monospace", fontSize: "11", children: ticket.date }),
        /* @__PURE__ */ jsx("text", { x: "24", y: "212", fill: "#888", fontFamily: "'Inter', sans-serif", fontWeight: "700", fontSize: "9", letterSpacing: "1.6", children: "DESDE" }),
        /* @__PURE__ */ jsx("text", { x: "24", y: "228", fill: "#F5F5F5", fontFamily: "'Archivo Black', 'Inter', sans-serif", fontWeight: "900", fontSize: "14", letterSpacing: "0.5", children: ticket.from }),
        /* @__PURE__ */ jsx("text", { x: "108", y: "222", fill: "#DBFF00", fontFamily: "'JetBrains Mono', monospace", fontSize: "14", letterSpacing: "1.5", children: "──▶" }),
        /* @__PURE__ */ jsx("text", { x: "150", y: "212", fill: "#888", fontFamily: "'Inter', sans-serif", fontWeight: "700", fontSize: "9", letterSpacing: "1.6", children: "HASTA" }),
        /* @__PURE__ */ jsx("text", { x: "150", y: "228", fill: "#F5F5F5", fontFamily: "'Archivo Black', 'Inter', sans-serif", fontWeight: "900", fontSize: "14", letterSpacing: "0.5", children: ticket.to }),
        /* @__PURE__ */ jsx("rect", { x: "24", y: "240", width: "108", height: "14", rx: "1", fill: "#111", stroke: "#2A2A2A", strokeWidth: "1" }),
        /* @__PURE__ */ jsx("circle", { cx: "31", cy: "247", r: "4", fill: "#DBFF00" }),
        /* @__PURE__ */ jsx("text", { x: "31", y: "247", fill: "#000", fontFamily: "'Archivo Black', sans-serif", fontSize: "6", textAnchor: "middle", dominantBaseline: "middle", children: ticket.driverInitial }),
        /* @__PURE__ */ jsx("text", { x: "40", y: "248", fill: "#F5F5F5", fontFamily: "'JetBrains Mono', monospace", fontSize: "8", dominantBaseline: "middle", children: ticket.driverName }),
        /* @__PURE__ */ jsxs("text", { x: "94", y: "248", fill: "#DBFF00", fontFamily: "'Inter', sans-serif", fontWeight: "700", fontSize: "8", dominantBaseline: "middle", children: [
          "★ ",
          ticket.rating.toFixed(1)
        ] }),
        /* @__PURE__ */ jsx("line", { x1: "260", y1: "10", x2: "260", y2: "250", stroke: "#2A2A2A", strokeDasharray: "4 3" }),
        /* @__PURE__ */ jsx("circle", { cx: "260", cy: "0", r: "10", fill: "#080808", stroke: "#2A2A2A" }),
        /* @__PURE__ */ jsx("circle", { cx: "260", cy: "260", r: "10", fill: "#080808", stroke: "#2A2A2A" }),
        /* @__PURE__ */ jsxs("g", { clipPath: "url(#priceClip)", children: [
          /* @__PURE__ */ jsx("rect", { x: "270", y: "60", width: "100", height: "120", fill: "#0A0A0A" }),
          /* @__PURE__ */ jsx("rect", { x: "-40", y: "60", width: "30", height: "120", fill: "url(#voltShine)", opacity: "0.18", children: /* @__PURE__ */ jsx("animate", { attributeName: "x", from: "270", to: "370", dur: "2.8s", repeatCount: "indefinite" }) })
        ] }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "320",
            y: "72",
            fill: "#888",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "700",
            fontSize: "8",
            letterSpacing: "1.6",
            textAnchor: "middle",
            children: "PRECIO"
          }
        ),
        /* @__PURE__ */ jsxs(
          "text",
          {
            x: "320",
            y: "116",
            fill: "#DBFF00",
            fontFamily: "'Archivo Black', 'Inter', sans-serif",
            fontWeight: "900",
            fontSize: "44",
            letterSpacing: "-2",
            textAnchor: "middle",
            children: [
              "€",
              ticket.price
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "320",
            y: "132",
            fill: "#888",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "600",
            fontSize: "8",
            letterSpacing: "2",
            textAnchor: "middle",
            children: "POR ASIENTO"
          }
        ),
        /* @__PURE__ */ jsx("rect", { x: "282", y: "144", width: "76", height: "22", fill: "#DBFF00" }),
        /* @__PURE__ */ jsxs(
          "text",
          {
            x: "320",
            y: "158",
            fill: "#000",
            fontFamily: "'Archivo Black', 'Inter', sans-serif",
            fontWeight: "900",
            fontSize: "10",
            letterSpacing: "1.5",
            textAnchor: "middle",
            children: [
              ticket.seats,
              " ",
              ticket.seats === 1 ? "PLAZA" : "PLAZAS"
            ]
          }
        ),
        /* @__PURE__ */ jsx("g", { transform: "translate(278, 192)", children: barcode.map((w, i) => {
          const x = barcode.slice(0, i).reduce((sum, n) => sum + n + 1, 0);
          return /* @__PURE__ */ jsx("rect", { x, y: 0, width: w, height: 28, fill: "#F5F5F5" }, i);
        }) }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "320",
            y: "238",
            fill: "#888",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "7",
            letterSpacing: "1.2",
            textAnchor: "middle",
            children: ticket.ridCode
          }
        )
      ]
    }
  );
}
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
function useCountUp({ target, duration = 1500, enabled = true }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now2) => {
      const elapsed = now2 - start;
      const progress2 = Math.min(1, elapsed / duration);
      setValue(Math.round(target * easeOutCubic(progress2)));
      if (progress2 < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);
  return value;
}
function useInView(options = { amount: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer2 = new IntersectionObserver(
      ([entry]) => {
        if (entry == null ? void 0 : entry.isIntersecting) {
          setInView(true);
          observer2.disconnect();
        }
      },
      { threshold: 0.2, ...options }
    );
    observer2.observe(el);
    return () => observer2.disconnect();
  }, [options]);
  return { ref, inView };
}
const STATS$1 = [
  { label: "festivales en el catálogo 2026", target: 16, suffix: "" },
  { label: "ciudades cubiertas en España", target: 20, suffix: "+" },
  { label: "ahorro estimado vs taxi", target: 60, suffix: "%" }
];
function Counter({ stat, enabled }) {
  const value = useCountUp({ target: stat.target, enabled });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxs("p", { className: "font-mono text-4xl md:text-6xl text-cr-primary leading-none tabular-nums", children: [
      stat.prefix ?? "",
      value.toLocaleString("es-ES"),
      stat.suffix ?? ""
    ] }),
    /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted", children: stat.label })
  ] });
}
function StatsBar() {
  const { ref, inView } = useInView();
  return /* @__PURE__ */ jsx(
    "section",
    {
      ref,
      "aria-label": "Estadísticas",
      className: "border-y border-cr-border bg-cr-surface py-12 md:py-16",
      children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 px-6", children: STATS$1.map((s) => /* @__PURE__ */ jsx(Counter, { stat: s, enabled: inView }, s.label)) })
    }
  );
}
function HorizontalCarousel({ concerts }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });
  const totalCards = concerts.length + 1;
  const CARD_WIDTH_PX = 400;
  const GAP_PX = 24;
  const totalWidthPx = totalCards * (CARD_WIDTH_PX + GAP_PX);
  const keepVisiblePx = 2 * (CARD_WIDTH_PX + GAP_PX);
  const translatePx = Math.max(0, totalWidthPx - keepVisiblePx);
  const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${translatePx}px`]);
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "discover-title", className: "bg-cr-bg text-cr-text", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-8 space-y-3", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Discover" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxs(
          "h2",
          {
            id: "discover-title",
            className: "font-display text-3xl md:text-5xl uppercase leading-[0.95]",
            children: [
              "Conciertos",
              /* @__PURE__ */ jsx("br", {}),
              "con viajes activos."
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/concerts",
            className: "hidden md:inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
            children: [
              "Ver todos",
              /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: "relative hidden md:block",
        style: { height: "180vh" },
        children: /* @__PURE__ */ jsx("div", { className: "sticky top-0 h-dvh flex items-center overflow-hidden", children: /* @__PURE__ */ jsxs(
          motion.ol,
          {
            style: { x },
            className: "flex gap-6 px-[6vw]",
            children: [
              concerts.map((c) => /* @__PURE__ */ jsx("li", { className: "shrink-0 w-[340px] lg:w-[400px]", children: /* @__PURE__ */ jsx(Link, { to: `/concerts/${c.id}`, className: "block", children: /* @__PURE__ */ jsx(ConcertCard, { concert: c }) }) }, c.id)),
              /* @__PURE__ */ jsx("li", { className: "shrink-0 w-[340px] lg:w-[400px] flex items-center justify-center", children: /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/concerts",
                  className: "h-full w-full border border-dashed border-cr-border aspect-[4/3] flex flex-col items-center justify-center gap-2 hover:border-cr-primary hover:text-cr-primary transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "font-display text-3xl uppercase", children: "Ver todos" }),
                    /* @__PURE__ */ jsx(ArrowRight, { size: 24 })
                  ]
                }
              ) })
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsxs("ol", { className: "flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-10 -mx-1 scroll-pl-6", children: [
      concerts.map((c) => /* @__PURE__ */ jsx("li", { className: "shrink-0 w-[78%] snap-start", children: /* @__PURE__ */ jsx(Link, { to: `/concerts/${c.id}`, className: "block", children: /* @__PURE__ */ jsx(ConcertCard, { concert: c }) }) }, c.id)),
      /* @__PURE__ */ jsx("li", { className: "shrink-0 w-[78%] snap-start", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/concerts",
          className: "block h-full border border-dashed border-cr-border aspect-[4/3] flex flex-col items-center justify-center gap-2 text-cr-text-muted hover:text-cr-primary",
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-display text-2xl uppercase", children: "Ver todos" }),
            /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
          ]
        }
      ) })
    ] }) })
  ] });
}
const STEPS = [
  {
    n: "01",
    icon: Calendar,
    title: "Elige el concierto",
    body: "Busca por artista o ciudad. Ve los viajes activos al momento."
  },
  {
    n: "02",
    icon: Car,
    title: "Encuentra o publica un viaje",
    body: "Reserva tu asiento o abre tu coche al resto. Divide el coste."
  },
  {
    n: "03",
    icon: Music,
    title: "A rockear juntos",
    body: "Playlist compartida, vibes elegidos, y al recinto a tiempo."
  }
];
function HowItWorks() {
  const { ref, inView } = useInView();
  return /* @__PURE__ */ jsx(
    "section",
    {
      ref,
      "aria-label": "Cómo funciona",
      className: "relative py-20 md:py-28 px-6",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxs("header", { className: "mb-12 md:mb-16 space-y-3", children: [
          /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Cómo funciona" }),
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-3xl md:text-5xl uppercase leading-[0.95]", children: [
            "Tres pasos",
            /* @__PURE__ */ jsx("br", {}),
            "hasta el show."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "hidden md:block absolute top-[52px] left-0 right-0 h-px bg-cr-border overflow-hidden",
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "block h-full bg-cr-primary origin-left transition-transform duration-[900ms] ease-out",
                  style: { transform: `scaleX(${inView ? 1 : 0})` }
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("ol", { className: "grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative", children: STEPS.map((step, i) => {
            const Icon2 = step.icon;
            return /* @__PURE__ */ jsxs(
              "li",
              {
                className: "space-y-4 transition-all duration-500 ease-out",
                style: {
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${i * 80}ms`
                },
                children: [
                  /* @__PURE__ */ jsx("p", { className: "font-mono text-5xl md:text-6xl text-cr-primary leading-none", children: step.n }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-cr-text-muted", children: [
                    /* @__PURE__ */ jsx(Icon2, { size: 18, "aria-hidden": "true" }),
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase tracking-wide text-cr-text", children: step.title })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted max-w-[28ch] leading-relaxed", children: step.body })
                ]
              },
              step.n
            );
          }) })
        ] })
      ] })
    }
  );
}
const SPANISH_CITIES = [
  { name: "A Coruña", lat: 43.3623, lng: -8.4115 },
  { name: "Albacete", lat: 38.9943, lng: -1.8585 },
  { name: "Alcalá de Henares", lat: 40.4817, lng: -3.3647 },
  { name: "Alcobendas", lat: 40.5467, lng: -3.6414 },
  { name: "Alcorcón", lat: 40.3474, lng: -3.8228 },
  { name: "Alcoy / Alcoi", lat: 38.6985, lng: -0.4742 },
  { name: "Algeciras", lat: 36.1408, lng: -5.4563 },
  { name: "Alicante / Alacant", lat: 38.3452, lng: -0.481 },
  { name: "Almería", lat: 36.8381, lng: -2.4597 },
  { name: "Arona", lat: 28.0997, lng: -16.6837 },
  { name: "Arrecife", lat: 28.9635, lng: -13.5481 },
  { name: "Ávila", lat: 40.6567, lng: -4.6814 },
  { name: "Badajoz", lat: 38.8794, lng: -6.9706 },
  { name: "Badalona", lat: 41.4502, lng: 2.2474 },
  { name: "Barakaldo", lat: 43.2956, lng: -2.9898 },
  { name: "Barcelona", lat: 41.3851, lng: 2.1734 },
  { name: "Bilbao", lat: 43.263, lng: -2.935 },
  { name: "Burgos", lat: 42.3439, lng: -3.6969 },
  { name: "Cáceres", lat: 39.4753, lng: -6.3723 },
  { name: "Cádiz", lat: 36.5298, lng: -6.2924 },
  { name: "Cartagena", lat: 37.6069, lng: -0.9863 },
  { name: "Castellón de la Plana", lat: 39.9864, lng: -0.0513 },
  { name: "Ceuta", lat: 35.8894, lng: -5.3198 },
  { name: "Ciudad Real", lat: 38.9856, lng: -3.9271 },
  { name: "Córdoba", lat: 37.8882, lng: -4.7794 },
  { name: "Cornellà de Llobregat", lat: 41.3553, lng: 2.072 },
  { name: "Cuenca", lat: 40.0682, lng: -2.1374 },
  { name: "Donostia / San Sebastián", lat: 43.3183, lng: -1.9812 },
  { name: "El Ejido", lat: 36.7741, lng: -2.8092 },
  { name: "El Puerto de Santa María", lat: 36.5963, lng: -6.2327 },
  { name: "Elche / Elx", lat: 38.2669, lng: -0.6979 },
  { name: "Fuenlabrada", lat: 40.2842, lng: -3.7946 },
  { name: "Getafe", lat: 40.3058, lng: -3.7327 },
  { name: "Gijón", lat: 43.5322, lng: -5.6611 },
  { name: "Girona", lat: 41.9794, lng: 2.8214 },
  { name: "Granada", lat: 37.1773, lng: -3.5986 },
  { name: "Guadalajara", lat: 40.6326, lng: -3.1674 },
  { name: "Huelva", lat: 37.2614, lng: -6.9447 },
  { name: "Huesca", lat: 42.1362, lng: -0.4085 },
  { name: "Ibiza / Eivissa", lat: 38.9067, lng: 1.4206 },
  { name: "Jaén", lat: 37.7796, lng: -3.7849 },
  { name: "Jerez de la Frontera", lat: 36.6817, lng: -6.1371 },
  { name: "L'Hospitalet de Llobregat", lat: 41.3598, lng: 2.0992 },
  { name: "La Laguna", lat: 28.4852, lng: -16.3159 },
  { name: "La Línea de la Concepción", lat: 36.1669, lng: -5.3493 },
  { name: "Las Palmas de Gran Canaria", lat: 28.1235, lng: -15.4363 },
  { name: "Leganés", lat: 40.3287, lng: -3.7641 },
  { name: "León", lat: 42.5987, lng: -5.5671 },
  { name: "Lleida", lat: 41.6175, lng: 0.62 },
  { name: "Logroño", lat: 42.4667, lng: -2.45 },
  { name: "Lugo", lat: 43.0097, lng: -7.5567 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Málaga", lat: 36.7213, lng: -4.4213 },
  { name: "Manresa", lat: 41.7286, lng: 1.8224 },
  { name: "Marbella", lat: 36.5101, lng: -4.8824 },
  { name: "Mataró", lat: 41.5378, lng: 2.444 },
  { name: "Melilla", lat: 35.2923, lng: -2.9381 },
  { name: "Mérida", lat: 38.9153, lng: -6.3522 },
  { name: "Móstoles", lat: 40.3228, lng: -3.8644 },
  { name: "Murcia", lat: 37.9922, lng: -1.1307 },
  { name: "Orihuela", lat: 37.9695, lng: -0.9442 },
  { name: "Ourense", lat: 42.3359, lng: -7.8639 },
  { name: "Oviedo", lat: 43.3619, lng: -5.8494 },
  { name: "Palencia", lat: 42.0097, lng: -4.5288 },
  { name: "Palma de Mallorca", lat: 39.5696, lng: 2.6502 },
  { name: "Pamplona / Iruña", lat: 42.8125, lng: -1.6458 },
  { name: "Parla", lat: 40.2383, lng: -3.7664 },
  { name: "Ponferrada", lat: 42.5459, lng: -6.5967 },
  { name: "Pontevedra", lat: 42.4333, lng: -8.6481 },
  { name: "Puerto del Rosario", lat: 28.4997, lng: -13.8634 },
  { name: "Reus", lat: 41.1544, lng: 1.1053 },
  { name: "Roquetas de Mar", lat: 36.7641, lng: -2.6147 },
  { name: "Sabadell", lat: 41.5435, lng: 2.1086 },
  { name: "Salamanca", lat: 40.9701, lng: -5.6635 },
  { name: "Santa Cruz de Tenerife", lat: 28.4636, lng: -16.2518 },
  { name: "Santa Coloma de Gramenet", lat: 41.451, lng: 2.2082 },
  { name: "Santander", lat: 43.4623, lng: -3.8099 },
  { name: "Santiago de Compostela", lat: 42.8782, lng: -8.5448 },
  { name: "Segovia", lat: 40.9429, lng: -4.1088 },
  { name: "Sevilla", lat: 37.3891, lng: -5.9845 },
  { name: "Soria", lat: 41.7648, lng: -2.4686 },
  { name: "Tarragona", lat: 41.1189, lng: 1.2445 },
  { name: "Terrassa", lat: 41.5633, lng: 2.0094 },
  { name: "Teruel", lat: 40.3456, lng: -1.1065 },
  { name: "Toledo", lat: 39.8628, lng: -4.0273 },
  { name: "Torrejón de Ardoz", lat: 40.4596, lng: -3.4791 },
  { name: "Torrent", lat: 39.4367, lng: -0.4659 },
  { name: "Torrevieja", lat: 37.978, lng: -0.6836 },
  { name: "Valencia", lat: 39.4699, lng: -0.3763 },
  { name: "Valladolid", lat: 41.6523, lng: -4.7245 },
  { name: "Vélez-Málaga", lat: 36.7806, lng: -4.1002 },
  { name: "Vigo", lat: 42.2406, lng: -8.7207 },
  { name: "Vitoria-Gasteiz", lat: 42.8467, lng: -2.6727 },
  { name: "Zamora", lat: 41.5036, lng: -5.7468 },
  { name: "Zaragoza", lat: 41.6488, lng: -0.8891 }
];
Object.fromEntries(
  SPANISH_CITIES.map((c) => [c.name, c])
);
const VIBE_LABELS = {
  party: { emoji: "🎉", label: "PARTY", description: "Volumen al máximo, playlist colaborativa." },
  chill: { emoji: "😌", label: "CHILL", description: "Conversación tranquila, música de fondo." },
  mixed: { emoji: "🎵", label: "MIXED", description: "Depende del grupo y del momento." }
};
const STYLES = {
  party: "bg-cr-secondary text-black",
  chill: "bg-cr-surface-2 text-cr-text-muted border border-cr-border",
  mixed: "bg-cr-primary text-black"
};
function VibeBadge({ vibe }) {
  const meta = VIBE_LABELS[vibe];
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] ${STYLES[vibe]}`,
      children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: meta.emoji }),
        /* @__PURE__ */ jsx("span", { children: meta.label })
      ]
    }
  );
}
function HotRidesBadge({ seatsTaken, seatsTotal }) {
  const occupancyRate = seatsTotal > 0 ? seatsTaken / seatsTotal * 100 : 0;
  if (occupancyRate < 75) return null;
  return /* @__PURE__ */ jsx("span", { className: "inline-block font-sans text-[10px] font-semibold text-cr-secondary bg-cr-secondary/20 px-1.5 py-0.5 tracking-[0.08em] rounded", children: "🔥 Popular" });
}
function SocialProofText({ seatsTaken, seatsTotal }) {
  if (seatsTotal === 0 || seatsTaken === 0) return null;
  const percentage = Math.round(seatsTaken / seatsTotal * 100);
  return /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-cr-text-dim mt-1", children: [
    seatsTaken,
    " confirmado",
    seatsTaken === 1 ? "" : "s",
    " · ",
    percentage,
    "% lleno"
  ] });
}
const LUGGAGE_LABEL = {
  none: "Sin equipaje",
  small: "Bolso pequeño",
  backpack: "Mochila máx.",
  cabin: "Maleta cabina",
  large: "Maleta grande",
  extra: "Extra"
};
function TicketCard({ ride, onClick }) {
  const { concert, driver } = ride;
  const label = `Viaje de ${ride.origin_city} a ${concert.artist} el ${formatDay(concert.date)}`;
  return /* @__PURE__ */ jsxs(
    motion.article,
    {
      whileHover: { y: -4, transition: { duration: 0.15 } },
      "aria-label": label,
      onClick,
      className: "group relative flex bg-cr-surface border border-cr-border hover:border-cr-primary/40 transition-colors cursor-pointer",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 p-5 space-y-3 min-w-0", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary", children: [
            "De · ",
            ride.origin_city
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg uppercase leading-tight truncate", children: concert.artist }),
            /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted truncate", children: [
              concert.venue.name,
              " · ",
              concert.venue.city
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-dim", children: [
              formatDay(concert.date),
              " · salida ",
              formatTime$1(ride.departure_time)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "aria-hidden": "true",
                className: "w-9 h-9 rounded-full bg-cr-surface-2 border border-cr-border flex items-center justify-center font-sans text-xs font-semibold text-cr-text",
                children: initials(driver.name)
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
              /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text flex items-center gap-1", children: [
                driver.name,
                driver.verified && /* @__PURE__ */ jsx("span", { className: "text-cr-primary", "aria-label": "Perfil verificado", children: "✓" })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "font-sans text-xs text-cr-text-muted flex items-center gap-1", children: [
                driver.rating_count >= 3 ? /* @__PURE__ */ jsxs("span", { className: "text-cr-primary", children: [
                  "★ ",
                  driver.rating.toFixed(1),
                  " ",
                  /* @__PURE__ */ jsxs("span", { className: "text-cr-text-dim", children: [
                    "(",
                    driver.rating_count,
                    ")"
                  ] }),
                  " ·"
                ] }) : null,
                /* @__PURE__ */ jsxs("span", { children: [
                  driver.rides_given,
                  " viajes"
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-px bg-transparent border-l border-dashed border-cr-border mx-1 my-0", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "absolute -left-[7px] -top-[7px] w-3 h-3 rounded-full bg-cr-bg border border-cr-border"
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: "absolute -left-[7px] -bottom-[7px] w-3 h-3 rounded-full bg-cr-bg border border-cr-border"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-32 p-5 flex flex-col justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "font-mono text-3xl text-cr-primary leading-none", children: [
              "€",
              ride.price_per_seat
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-sans text-[10px] font-semibold text-cr-text-muted uppercase tracking-[0.08em] mt-1", children: "/asiento" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs("p", { className: `font-sans text-sm flex items-center gap-1.5 ${ride.seats_left === 1 ? "text-cr-secondary font-semibold" : "text-cr-text-muted"}`, children: [
              /* @__PURE__ */ jsx(Users, { size: 12, "aria-hidden": "true" }),
              ride.seats_left === 0 ? "Completo" : `${ride.seats_left} plaza${ride.seats_left === 1 ? "" : "s"}`
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsx(VibeBadge, { vibe: ride.vibe }),
              ride.instant_booking && /* @__PURE__ */ jsx("span", { className: "inline-block font-sans text-xs font-semibold text-black bg-cr-primary px-1.5 py-0.5 tracking-[0.08em]", children: "Instante" }),
              ride.price_negotiable && /* @__PURE__ */ jsx("span", { className: "inline-block font-sans text-xs font-semibold text-cr-primary border border-cr-primary px-1.5 py-0.5 tracking-[0.08em]", children: "Negociable" }),
              /* @__PURE__ */ jsx(HotRidesBadge, { seatsTaken: ride.seats_total - ride.seats_left, seatsTotal: ride.seats_total })
            ] }),
            /* @__PURE__ */ jsx(SocialProofText, { seatsTaken: ride.seats_total - ride.seats_left, seatsTotal: ride.seats_total }),
            /* @__PURE__ */ jsxs("p", { className: "font-sans text-xs text-cr-text-dim", children: [
              ride.smoking_policy === "no" ? "🚭" : "🚬",
              " ",
              ride.smoking_policy === "no" ? "No fumar" : "Fumadores"
            ] }),
            ride.max_luggage !== "extra" && /* @__PURE__ */ jsxs("p", { className: "font-sans text-xs text-cr-text-dim truncate", children: [
              "🧳 ",
              LUGGAGE_LABEL[ride.max_luggage]
            ] })
          ] })
        ] }),
        ride.playlist_url && /* @__PURE__ */ jsx(
          "a",
          {
            href: ride.playlist_url,
            target: "_blank",
            rel: "noreferrer",
            onClick: (e) => e.stopPropagation(),
            "aria-label": "Playlist del viaje",
            className: "absolute bottom-2 right-2 text-cr-text-muted hover:text-cr-primary transition-colors",
            children: /* @__PURE__ */ jsx(Music, { size: 14 })
          }
        )
      ]
    }
  );
}
function LoadingSpinner({ text = "Cargando..." }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-12", children: [
    /* @__PURE__ */ jsx(
      LoaderCircle,
      {
        className: "animate-spin text-cr-primary",
        size: 32,
        strokeWidth: 1.75
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "text-cr-text-muted font-sans text-sm animate-pulse", children: text })
  ] });
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-cr-surface border border-cr-border overflow-hidden cr-shimmer", children: [
    /* @__PURE__ */ jsx("div", { className: "h-48 w-full bg-cr-surface-2" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 w-3/4 bg-cr-surface-2 rounded-sm" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 w-1/2 bg-cr-surface-2 rounded-sm" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-cr-surface-2 rounded-sm" })
    ] })
  ] });
}
function AdhocRidesSection() {
  const navigate = useNavigate();
  const [rides, setRides] = useState(null);
  useEffect(() => {
    api.rides.list({ adhoc: true }).then((r) => setRides(r.rides)).catch(() => setRides([]));
  }, []);
  if (rides !== null && rides.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { "aria-labelledby": "adhoc-heading", className: "py-16 md:py-24 border-t border-cr-border", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
    /* @__PURE__ */ jsx("header", { className: "mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(PenLine, { size: 12, "aria-hidden": "true" }),
        " Conciertos no listados"
      ] }),
      /* @__PURE__ */ jsxs(
        "h2",
        {
          id: "adhoc-heading",
          className: "font-display uppercase text-3xl md:text-4xl leading-[0.95]",
          children: [
            "Viajes para",
            /* @__PURE__ */ jsx("br", {}),
            "otros conciertos"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted max-w-md", children: [
        "Viajes publicados por conductores para conciertos que todavía no aparecen en nuestra agenda. ¿El tuyo tampoco está?",
        " ",
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/publish",
            className: "text-cr-primary underline hover:no-underline",
            children: "Publícalo ahora."
          }
        )
      ] })
    ] }) }),
    rides === null ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx(SkeletonCard, {}, i)) }) : /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: rides.slice(0, 6).map((ride) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(TicketCard, { ride, onClick: () => navigate(`/rides/${ride.id}`) }) }, ride.id)) })
  ] }) });
}
const MESSAGES = [
  "Soundchecking...",
  "Afinando la guitarra...",
  "Calentando motores...",
  "Revisando el setlist...",
  "Buscando tu crew...",
  "Amplificando resultados..."
];
function useRotatingMessage(intervalMs = 1600) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id2 = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), intervalMs);
    return () => clearInterval(id2);
  }, [intervalMs]);
  return MESSAGES[i] ?? MESSAGES[0];
}
function PulsingDot({ label = "Cargando" }) {
  const message = useRotatingMessage();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ jsxs(
      "span",
      {
        "aria-hidden": "true",
        className: "relative flex w-2 h-2",
        children: [
          /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-full bg-cr-primary opacity-75 animate-ping" }),
          /* @__PURE__ */ jsx("span", { className: "relative rounded-full w-2 h-2 bg-cr-primary" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-cr-text-muted", children: [
      message,
      /* @__PURE__ */ jsxs("span", { className: "sr-only", children: [
        " — ",
        label
      ] })
    ] })
  ] });
}
function TicketCardSkeleton() {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-hidden": "true",
      className: "relative flex bg-cr-surface border border-cr-border overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 p-5 space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-3 w-20 bg-cr-surface-2 cr-shimmer" }),
          /* @__PURE__ */ jsx("div", { className: "h-5 w-3/4 bg-cr-surface-2 cr-shimmer" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-1/2 bg-cr-surface-2 cr-shimmer" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-cr-surface-2 cr-shimmer" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsx("div", { className: "h-2.5 w-24 bg-cr-surface-2 cr-shimmer" }),
              /* @__PURE__ */ jsx("div", { className: "h-2.5 w-16 bg-cr-surface-2 cr-shimmer" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-px border-l border-dashed border-cr-border" }),
        /* @__PURE__ */ jsxs("div", { className: "w-32 p-5 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-6 w-12 bg-cr-surface-2 cr-shimmer" }),
            /* @__PURE__ */ jsx("div", { className: "h-2.5 w-10 bg-cr-surface-2 cr-shimmer" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-5 w-16 bg-cr-surface-2 cr-shimmer" })
        ] })
      ]
    }
  );
}
const MapView = lazy(() => import("./assets/MapView-KmlEIXyd.js"));
function MapSection({ concerts, rides }) {
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "map-title", className: "space-y-5 border-t border-cr-border", children: [
    /* @__PURE__ */ jsxs("header", { className: "max-w-6xl mx-auto px-6 pt-16 md:pt-24 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "En vivo" }),
        /* @__PURE__ */ jsx(PulsingDot, { label: "En tiempo real" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxs(
          "h2",
          {
            id: "map-title",
            className: "font-display text-3xl md:text-5xl uppercase leading-[0.95]",
            children: [
              "Viajes activos",
              /* @__PURE__ */ jsx("br", {}),
              "ahora mismo."
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "font-mono text-xs text-cr-text-muted text-right hidden sm:block pb-1", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-semibold", children: concerts.length }),
            " conciertos"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-secondary font-semibold", children: rides.length }),
            " viajes"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted max-w-md", children: "Filtra por ciudad. Haz clic en un concierto para ver los viajes disponibles." })
    ] }),
    /* @__PURE__ */ jsx(
      Suspense,
      {
        fallback: /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "h-[60vh] min-h-[420px] w-full bg-cr-surface border-y border-cr-border flex items-center justify-center",
            children: /* @__PURE__ */ jsx(PulsingDot, { label: "Cargando mapa" })
          }
        ),
        children: /* @__PURE__ */ jsx(MapView, { concerts, rides })
      }
    )
  ] });
}
const TRUST_POINTS = [
  "Perfil verificado con DNI",
  "Conductores con carnet verificado",
  "Sin comisiones de plataforma"
];
function TrustSection() {
  return /* @__PURE__ */ jsx(
    "section",
    {
      "aria-labelledby": "trust-title",
      className: "py-20 md:py-28 px-6 border-t border-cr-border",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto space-y-12 md:space-y-16", children: [
        /* @__PURE__ */ jsxs("header", { className: "space-y-3 max-w-2xl", children: [
          /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Social proof" }),
          /* @__PURE__ */ jsxs("h2", { id: "trust-title", className: "font-display text-3xl md:text-5xl uppercase leading-[0.95]", children: [
            "Gente de verdad.",
            /* @__PURE__ */ jsx("br", {}),
            "Viajes de verdad."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-10 md:p-16 flex flex-col items-center gap-4 text-center", children: [
          /* @__PURE__ */ jsx(MessageSquare, { size: 28, className: "text-cr-text-dim", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted max-w-sm leading-relaxed", children: "Sé el primero en compartir tu experiencia. Las valoraciones de usuarios reales aparecerán aquí." }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/concerts",
              className: "font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border border-cr-primary/40 px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
              children: "Buscar viaje →"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-dashed border-cr-border pt-8", children: TRUST_POINTS.map((point2) => /* @__PURE__ */ jsxs(
          "li",
          {
            className: "flex items-center gap-2 font-sans text-xs text-cr-text-muted",
            children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center w-4 h-4 rounded-full bg-cr-primary/15 text-cr-primary", children: /* @__PURE__ */ jsx(Check, { size: 10, strokeWidth: 3, "aria-hidden": "true" }) }),
              point2
            ]
          },
          point2
        )) })
      ] })
    }
  );
}
function TestimonialsSection() {
  return /* @__PURE__ */ jsx("section", { "aria-labelledby": "testimonials-title", className: "border-t border-cr-border", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-10", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Comunidad" }),
      /* @__PURE__ */ jsxs(
        "h2",
        {
          id: "testimonials-title",
          className: "font-display text-3xl md:text-5xl uppercase leading-[0.95]",
          children: [
            "Lo que dicen",
            /* @__PURE__ */ jsx("br", {}),
            "los usuarios."
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-10 md:p-16 flex flex-col items-center gap-4 text-center", children: [
      /* @__PURE__ */ jsx(MessageSquare, { size: 28, className: "text-cr-text-dim", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted max-w-sm leading-relaxed", children: "Sé el primero en compartir tu experiencia. Las valoraciones de usuarios reales aparecerán aquí." }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/concerts",
          className: "font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border border-cr-primary/40 px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
          children: "Buscar viaje →"
        }
      )
    ] })
  ] }) });
}
function FinalCTA() {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      "aria-labelledby": "final-cta",
      className: "relative min-h-dvh flex items-center justify-center overflow-hidden bg-cr-bg",
      children: [
        /* @__PURE__ */ jsx(CornerAccents, {}),
        /* @__PURE__ */ jsxs("div", { className: "relative text-center px-6 max-w-4xl mx-auto space-y-10", children: [
          /* @__PURE__ */ jsxs(
            motion.h2,
            {
              id: "final-cta",
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.4 },
              transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
              className: "font-display uppercase leading-[0.9] text-[52px] sm:text-[88px] md:text-[132px]",
              children: [
                "¿Listo ",
                /* @__PURE__ */ jsx("br", {}),
                /* @__PURE__ */ jsx("span", { className: "text-cr-primary", children: "para el show?" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.4 },
              transition: { duration: 0.4, delay: 0.15 },
              className: "flex flex-col sm:flex-row gap-3 justify-center",
              children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/concerts",
                    className: "inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100",
                    children: "Buscar un viaje"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/publish",
                    className: "inline-flex items-center justify-center bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-8 py-4 transition-colors duration-150",
                    children: "Ofrecer mi coche"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport: { once: true },
              transition: { duration: 0.5, delay: 0.3 },
              className: "font-mono text-xs text-cr-text-muted",
              children: "Madrid · Barcelona · Valencia · Sevilla · Bilbao · Zaragoza · y más"
            }
          )
        ] })
      ]
    }
  );
}
function CornerAccents() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-10 left-10 w-16 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-10 left-10 w-px h-16 bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-10 right-10 w-16 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute top-10 right-10 w-px h-16 bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-10 left-10 w-16 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-10 left-10 w-px h-16 bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-10 right-10 w-16 h-px bg-cr-primary" }),
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "absolute bottom-10 right-10 w-px h-16 bg-cr-primary" })
  ] });
}
function LandingPage() {
  useSeoMeta({
    title: "ConcertRide ES — Carpooling para conciertos en España | Viajes compartidos",
    description: "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis, sin comisiones.",
    canonical: `${SITE_URL}/`,
    keywords: "carpooling conciertos España, viajes compartidos festivales, transporte a conciertos, coche compartido música, ride-sharing festivales, deja tu coche en casa festival, compartir coche festival España, carpooling sin comisiones, volver festival madrugada, movilidad sostenible festival, compartir gastos festival, ir al festival sin coche",
    ogType: "website"
  });
  const [concerts, setConcerts] = useState(null);
  const [rides, setRides] = useState(null);
  useEffect(() => {
    Promise.all([api.concerts.list({ limit: 50, date_from: (/* @__PURE__ */ new Date()).toISOString() }), api.rides.list({})]).then(([c, r]) => {
      setConcerts(c.concerts);
      setRides(r.rides);
    }).catch(() => {
      setConcerts([]);
      setRides([]);
    });
  }, []);
  const activeConcerts = useMemo(() => {
    const nowMs = Date.now();
    const futuros = (concerts ?? []).filter((c) => {
      const t = new Date(c.date).getTime();
      return Number.isFinite(t) && t > nowMs && concertStatus(c.date) === "upcoming";
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futuros.slice(0, 10);
  }, [concerts]);
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1e3;
  const mapConcerts = useMemo(() => {
    const nowMs = Date.now();
    const cutoffMs = nowMs + NINETY_DAYS_MS;
    return (concerts ?? []).filter((c) => {
      const t = new Date(c.date).getTime();
      return t >= nowMs && t <= cutoffMs;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 20);
  }, [concerts]);
  const mapRides = useMemo(() => {
    const nearConcertIds = new Set(mapConcerts.map((c) => c.id));
    return (rides ?? []).filter(
      (r) => r.seats_left > 0 && r.status === "active" && nearConcertIds.has(r.concert_id)
    );
  }, [mapConcerts, rides]);
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "bg-cr-bg text-cr-text", children: [
    activeConcerts.length > 0 && /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Próximos conciertos con viajes compartidos en España",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: activeConcerts.length,
            itemListElement: activeConcerts.slice(0, 10).map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/concerts/${c.id}`,
              name: `${c.artist} — ${c.venue.name}, ${c.venue.city}`
            }))
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(StatsBar, {}),
    activeConcerts.length > 0 && /* @__PURE__ */ jsx(HorizontalCarousel, { concerts: activeConcerts }),
    /* @__PURE__ */ jsx(HowItWorks, {}),
    /* @__PURE__ */ jsx(AdhocRidesSection, {}),
    mapConcerts.length > 0 && /* @__PURE__ */ jsx(MapSection, { concerts: mapConcerts, rides: mapRides }),
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx("section", { className: "border-t border-cr-border bg-cr-bg", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("blockquote", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted italic leading-relaxed", children: '"El transporte de los asistentes supone el 80 % de la huella de carbono de un festival. El carpooling es la acción individual más efectiva para reducirla."' }),
        /* @__PURE__ */ jsxs("footer", { className: "font-mono text-[10px] text-cr-text-dim", children: [
          "—",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://juliesbicycle.com/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-cr-primary", children: "Julie's Bicycle Green Events Guide" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("blockquote", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted italic leading-relaxed", children: '"España celebró más de 1.000 festivales con más de 25 millones de asistentes en 2024 y una facturación que superó los 600 millones de euros."' }),
        /* @__PURE__ */ jsxs("footer", { className: "font-mono text-[10px] text-cr-text-dim", children: [
          "—",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://www.apmusicales.com/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-cr-primary", children: "Asociación de Promotores Musicales (APM)" }),
          ", Informe 2024"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("blockquote", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted italic leading-relaxed", children: '"España figura entre los cinco mercados de música en vivo con mayor crecimiento de Europa en 2023–2024."' }),
        /* @__PURE__ */ jsxs("footer", { className: "font-mono text-[10px] text-cr-text-dim", children: [
          "—",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://www.pollstar.com/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-cr-primary", children: "Pollstar" }),
          ", ranking europeo de música en directo"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-t border-cr-border bg-cr-bg", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Guías y recursos" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Todo lo que necesitas saber" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/guia-transporte-festivales",
            className: "border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary", children: "Guía" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Guía de transporte para festivales" }),
              /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed", children: "Carpooling, lanzaderas, tren o taxi: cuándo usar cada opción y cómo ahorrar en el trayecto." }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-sans text-xs text-cr-primary", children: [
                "Leer ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 11 })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/blog/como-volver-festival-madrugada",
            className: "border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary", children: "Guía" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Cómo volver de un festival de madrugada" }),
              /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed", children: "El último metro sale a la 1:30 y el festival acaba a las 2:30. Opciones reales sin pagar 90 € de taxi." }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-sans text-xs text-cr-primary", children: [
                "Leer ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 11 })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/rutas/madrid-mad-cool",
            className: "border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary", children: "Ruta" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Carpooling Madrid → Mad Cool" }),
              /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed", children: "Precios, tiempo de conducción y horarios de vuelta para la ruta más popular a Mad Cool 2026." }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-sans text-xs text-cr-primary", children: [
                "Ver ruta ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 11 })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/rutas/madrid-primavera-sound",
            className: "border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary", children: "Ruta" }),
              /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Carpooling Madrid → Primavera Sound" }),
              /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed", children: "Madrid–Barcelona en coche compartido: 620 km, ~5 h 30 min, desde 14 €/asiento." }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-sans text-xs text-cr-primary", children: [
                "Ver ruta ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 11 })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/blog",
            className: "border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3 flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary", children: "Blog" }),
                /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Más artículos y guías" }),
                /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed", children: "Comparativas, datos de sostenibilidad y todo lo que necesitas para ir a un festival en España." })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 font-sans text-xs text-cr-primary mt-3", children: [
                "Ver blog ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 11 })
              ] })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(TestimonialsSection, {}),
    /* @__PURE__ */ jsx(FinalCTA, {})
  ] });
}
const PAGE_SIZE = 24;
const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1e3;
const EMPTY_FILTERS$1 = {
  city: "",
  dateFrom: "",
  dateTo: "",
  artist: "",
  genre: "",
  festival: false
};
function hasActiveFilters(f) {
  return Object.values(f).some(Boolean);
}
const BREADCRUMB_CONCERTS_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` }
  ]
});
function ConcertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [concerts, setConcerts] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS$1);
  const [showFilters, setShowFilters] = useState(false);
  const [facets, setFacets] = useState({ genres: [], cities: [] });
  const tab = searchParams.get("tab") === "past" ? "past" : "active";
  const gridRef = useRef(null);
  useEffect(() => {
    api.concerts.facets().then(setFacets).catch(() => setFacets({ genres: [], cities: [] }));
  }, []);
  const dynamicTitle = useMemo(() => {
    if (!hasActiveFilters(filters)) return "Conciertos y festivales en España";
    const parts = [];
    if (filters.artist) parts.push(`de ${filters.artist}`);
    if (filters.city) parts.push(`en ${filters.city}`);
    if (filters.genre) parts.push(filters.genre);
    return `Conciertos ${parts.join(" ")}`.trim();
  }, [filters]);
  useSeoMeta({
    title: dynamicTitle,
    description: filters.city ? `Todos los conciertos y festivales en ${filters.city}. Encuentra viajes compartidos baratos desde cualquier ciudad con ConcertRide ES.` : "Todos los conciertos y festivales de música en España. Encuentra viajes compartidos baratos para llegar al show desde Madrid, Barcelona, Valencia, Sevilla y más.",
    canonical: `${SITE_URL}/concerts`,
    keywords: `conciertos ${filters.city || "España"}, festivales música, carpooling conciertos, viajes compartidos, ${filters.genre || "música en directo"}`
  });
  const debounceRef = useRef(null);
  const [debouncedArtist, setDebouncedArtist] = useState("");
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedArtist(filters.artist), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters.artist]);
  const fetchConcerts = useCallback(() => {
    const nowISO = (/* @__PURE__ */ new Date()).toISOString();
    const twoMonthsAgoISO = new Date(Date.now() - TWO_MONTHS_MS).toISOString();
    setLoading(true);
    setConcerts(null);
    const baseDateFrom = tab === "past" ? twoMonthsAgoISO : nowISO;
    const baseDateTo = tab === "past" ? nowISO : void 0;
    const params = {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      city: filters.city || void 0,
      artist: debouncedArtist || void 0,
      genre: filters.genre || void 0,
      festival: filters.festival || void 0,
      date_from: filters.dateFrom ? tab === "active" && new Date(filters.dateFrom) < /* @__PURE__ */ new Date() ? nowISO : new Date(filters.dateFrom).toISOString() : baseDateFrom,
      date_to: filters.dateTo ? (/* @__PURE__ */ new Date(filters.dateTo + "T23:59:59")).toISOString() : baseDateTo
    };
    setLoadError(false);
    api.concerts.list(params).then((r) => {
      setConcerts(r.concerts);
      setTotal(r.total);
    }).catch(() => {
      setConcerts([]);
      setTotal(0);
      setLoadError(true);
    }).finally(() => setLoading(false));
  }, [tab, page, filters.city, filters.genre, filters.festival, filters.dateFrom, filters.dateTo, debouncedArtist]);
  useEffect(() => {
    var _a2;
    fetchConcerts();
    if (page > 1) (_a2 = gridRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [fetchConcerts, page]);
  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }
  function setTab(t) {
    setSearchParams(t === "past" ? { tab: "past" } : {}, { replace: true });
    setFilters(EMPTY_FILTERS$1);
    setPage(1);
  }
  function goToPage(p) {
    var _a2;
    setPage(p);
    (_a2 = gridRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const pageConcerts = concerts ?? [];
  const totalPages = Math.ceil(total / PAGE_SIZE);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-cr-bg text-cr-text pt-16", children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: BREADCRUMB_CONCERTS_JSON_LD }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Explorar" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
          "Todos los",
          /* @__PURE__ */ jsx("br", {}),
          "conciertos."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setFilter("festival", !filters.festival),
              "aria-pressed": filters.festival,
              className: `inline-flex items-center gap-2 px-4 py-2 border font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${filters.festival ? "border-cr-secondary text-cr-secondary bg-cr-secondary/10" : "border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"}`,
              children: [
                /* @__PURE__ */ jsx(Sparkles, { size: 13 }),
                "Solo festivales"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowFilters((v) => !v),
              className: `inline-flex items-center gap-2 px-4 py-2 border font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${hasActiveFilters(filters) || showFilters ? "border-cr-primary text-cr-primary bg-cr-primary/5" : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"}`,
              children: [
                /* @__PURE__ */ jsx(SlidersHorizontal, { size: 13 }),
                "Filtrar",
                hasActiveFilters(filters) && /* @__PURE__ */ jsx("span", { className: "bg-cr-primary text-black w-4 h-4 flex items-center justify-center text-[9px] font-bold", children: Object.values(filters).filter(Boolean).length })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "search",
          placeholder: "Buscar artista o festival…",
          value: filters.artist,
          onChange: (e) => setFilter("artist", e.target.value),
          className: "w-full bg-cr-surface border border-cr-border px-4 py-3 font-mono text-sm text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary transition-colors"
        }
      ),
      showFilters && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border border-cr-border bg-cr-surface", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted", children: "Ciudad" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.city,
              onChange: (e) => setFilter("city", e.target.value),
              className: "w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Todas" }),
                facets.cities.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted", children: "Género" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.genre,
              onChange: (e) => setFilter("genre", e.target.value),
              disabled: facets.genres.length === 0,
              className: "w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark] disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Todos" }),
                facets.genres.map((g) => /* @__PURE__ */ jsx("option", { value: g, children: g }, g))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted", children: "Desde" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: filters.dateFrom,
              onChange: (e) => setFilter("dateFrom", e.target.value),
              className: "w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx("label", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted", children: "Hasta" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: filters.dateTo,
              onChange: (e) => setFilter("dateTo", e.target.value),
              className: "w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
            }
          )
        ] }),
        hasActiveFilters(filters) && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setFilters(EMPTY_FILTERS$1);
              setPage(1);
            },
            className: "col-span-2 md:col-span-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:text-cr-primary transition-colors",
            children: [
              /* @__PURE__ */ jsx(X, { size: 12 }),
              "Limpiar filtros"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-0 border-b border-cr-border", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setTab("active"),
            className: `inline-flex items-center gap-1.5 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-b-2 -mb-px transition-colors ${tab === "active" ? "border-cr-primary text-cr-primary" : "border-transparent text-cr-text-muted hover:text-cr-text"}`,
            children: [
              /* @__PURE__ */ jsx(Zap, { size: 12 }),
              "Próximos",
              !loading && tab === "active" && total > 0 && /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] text-cr-text-dim", children: [
                "(",
                total,
                ")"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setTab("past"),
            className: `inline-flex items-center gap-1.5 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-b-2 -mb-px transition-colors ${tab === "past" ? "border-cr-primary text-cr-primary" : "border-transparent text-cr-text-muted hover:text-cr-text"}`,
            children: [
              /* @__PURE__ */ jsx(Clock, { size: 12 }),
              "Pasados",
              !loading && tab === "past" && total > 0 && /* @__PURE__ */ jsxs("span", { className: "font-mono text-[10px] text-cr-text-dim", children: [
                "(",
                total,
                ")"
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { ref: gridRef, className: "max-w-6xl mx-auto px-6 pb-24", children: loading ? /* @__PURE__ */ jsx(LoadingSpinner, { text: "Cargando conciertos…" }) : loadError ? /* @__PURE__ */ jsxs("div", { className: "py-24 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "font-display text-2xl uppercase text-cr-text-muted mb-2", children: "Error al cargar" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-dim", children: "No se pudieron cargar los conciertos. Inténtalo de nuevo." })
    ] }) : pageConcerts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-24 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "font-display text-2xl uppercase text-cr-text-muted mb-2", children: "Sin resultados" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-dim", children: "Prueba a cambiar los filtros." })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: pageConcerts.map((c) => /* @__PURE__ */ jsx(Link, { to: `/concerts/${c.id}`, className: "block", children: /* @__PURE__ */ jsx(ConcertCard, { concert: c }) }, c.id)) }),
      totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mt-12", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => goToPage(page - 1),
            disabled: page === 1,
            className: "inline-flex items-center gap-1 px-3 py-2 border border-cr-border font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:border-cr-primary hover:text-cr-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { size: 13 }),
              "Anterior"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-cr-text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "text-cr-text font-semibold", children: page }),
          " ",
          "/",
          " ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => goToPage(page + 1),
            disabled: page === totalPages,
            className: "inline-flex items-center gap-1 px-3 py-2 border border-cr-border font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:border-cr-primary hover:text-cr-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
            children: [
              "Siguiente",
              /* @__PURE__ */ jsx(ChevronRight, { size: 13 })
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function buildShareUrl(path, utm) {
  const base = typeof window !== "undefined" ? window.location.origin : SITE_URL;
  const url = new URL(path, base);
  url.searchParams.set("utm_source", utm.source);
  url.searchParams.set("utm_medium", utm.medium);
  url.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) url.searchParams.set("utm_content", utm.content);
  return url.toString();
}
function concertShareUrl(concertId, campaign, source = "copy") {
  return buildShareUrl(`/concerts/${concertId}`, { source, medium: "share", campaign });
}
const EMPTY_FILTERS = {
  origin_city: "",
  max_price: "",
  vibe: "",
  round_trip: "any",
  no_smoking: false,
  near_lat: null,
  near_lng: null,
  radius_km: 30
};
function FilterBar({ value, onChange, cities, sticky = true }) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  function set(key, v) {
    onChange({ ...value, [key]: v });
  }
  function toggleNearMe() {
    if (value.near_lat !== null) {
      onChange({ ...value, near_lat: null, near_lng: null });
      return;
    }
    if (!navigator.geolocation) {
      setLocError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ ...value, near_lat: pos.coords.latitude, near_lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError("No se pudo obtener tu ubicación.");
        setLocating(false);
      }
    );
  }
  const fieldCls = "bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2.5 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors [color-scheme:dark]";
  const hasActiveFilters2 = value.origin_city || value.max_price || value.vibe || value.round_trip !== "any" || value.no_smoking || value.near_lat !== null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: sticky ? "sticky top-0 z-30 bg-cr-bg/95 backdrop-blur supports-[backdrop-filter]:bg-cr-bg/80" : "",
      children: /* @__PURE__ */ jsxs(
        "form",
        {
          role: "search",
          "aria-label": "Filtrar viajes",
          className: "flex flex-wrap gap-2 px-4 md:px-6 py-3 border-b border-cr-border",
          children: [
            /* @__PURE__ */ jsxs("label", { className: "flex-1 min-w-[140px]", children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Ciudad de origen" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: value.origin_city,
                  onChange: (e) => set("origin_city", e.target.value),
                  disabled: value.near_lat !== null,
                  className: `${fieldCls} w-full disabled:opacity-40`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Origen · todos" }),
                    cities.map((city) => /* @__PURE__ */ jsx("option", { value: city, children: city }, city))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "w-[120px]", children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Precio máximo" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  inputMode: "numeric",
                  min: 1,
                  max: 500,
                  value: value.max_price,
                  onChange: (e) => set("max_price", e.target.value),
                  placeholder: "Máx. €",
                  className: `${fieldCls} w-full font-mono`
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "w-[120px]", children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Vibe" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: value.vibe,
                  onChange: (e) => set("vibe", e.target.value),
                  className: `${fieldCls} w-full`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Vibe" }),
                    /* @__PURE__ */ jsx("option", { value: "party", children: "Party" }),
                    /* @__PURE__ */ jsx("option", { value: "mixed", children: "Mixed" }),
                    /* @__PURE__ */ jsx("option", { value: "chill", children: "Chill" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "w-[140px]", children: [
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Ida y vuelta" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: value.round_trip,
                  onChange: (e) => set("round_trip", e.target.value),
                  className: `${fieldCls} w-full`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "any", children: "Ida (y vuelta)" }),
                    /* @__PURE__ */ jsx("option", { value: "yes", children: "Ida y vuelta" }),
                    /* @__PURE__ */ jsx("option", { value: "no", children: "Solo ida" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => set("no_smoking", !value.no_smoking),
                title: value.no_smoking ? "Quitar filtro no fumadores" : "Solo viajes sin fumadores",
                className: `flex items-center gap-1.5 px-3 py-2.5 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${value.no_smoking ? "border-cr-primary bg-cr-primary/[0.08] text-cr-primary" : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"}`,
                children: "🚭 No fumar"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: toggleNearMe,
                  disabled: locating,
                  title: value.near_lat !== null ? "Desactivar filtro por ubicación" : "Buscar salidas cerca de mí",
                  className: `flex items-center gap-1.5 px-3 py-2.5 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors disabled:opacity-40 ${value.near_lat !== null ? "border-cr-primary bg-cr-primary/[0.08] text-cr-primary" : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"}`,
                  children: [
                    /* @__PURE__ */ jsx(LocateFixed, { size: 13, "aria-hidden": "true" }),
                    locating ? "…" : value.near_lat !== null ? "Cerca de mí" : "Cerca de mí"
                  ]
                }
              ),
              value.near_lat !== null && /* @__PURE__ */ jsxs(
                "select",
                {
                  value: value.radius_km,
                  onChange: (e) => set("radius_km", Number(e.target.value)),
                  "aria-label": "Radio de búsqueda",
                  className: "bg-cr-surface border-2 border-cr-primary outline-none px-2 py-2.5 font-mono text-xs text-cr-primary [color-scheme:dark]",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: 10, children: "10 km" }),
                    /* @__PURE__ */ jsx("option", { value: 30, children: "30 km" }),
                    /* @__PURE__ */ jsx("option", { value: 50, children: "50 km" }),
                    /* @__PURE__ */ jsx("option", { value: 100, children: "100 km" }),
                    /* @__PURE__ */ jsx("option", { value: 200, children: "200 km" })
                  ]
                }
              )
            ] }),
            locError && /* @__PURE__ */ jsx("p", { className: "w-full font-mono text-[10px] text-cr-secondary px-1", children: locError }),
            hasActiveFilters2 && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  onChange(EMPTY_FILTERS);
                  setLocError("");
                },
                className: "font-sans text-xs uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary px-3 py-2.5 border-2 border-transparent hover:border-cr-border transition-colors",
                children: "Limpiar"
              }
            )
          ]
        }
      )
    }
  );
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
const URL_RE = /https?:\/\/[^\s]+/g;
function detectUrls(text) {
  return [...text.matchAll(URL_RE)].map((m) => m[0]);
}
function LinkPreview({ url }) {
  let display = url;
  try {
    const u = new URL(url);
    display = u.hostname + (u.pathname !== "/" ? u.pathname : "");
    if (display.length > 48) display = display.slice(0, 48) + "…";
  } catch {
  }
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "mt-1.5 flex items-center gap-2 border border-cr-border bg-cr-bg px-2 py-1.5 text-[10px] text-cr-primary hover:bg-cr-surface transition-colors",
      children: [
        /* @__PURE__ */ jsx("span", { className: "font-mono truncate", children: display }),
        /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 text-cr-text-dim", children: "↗" })
      ]
    }
  );
}
function LocationBubble({ body, isOwn }) {
  const [lat, lng] = body.split(",").map(Number);
  const valid = !isNaN(lat) && !isNaN(lng);
  const mapsUrl = valid ? `https://maps.google.com/?q=${lat},${lng}` : "#";
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: mapsUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      className: `flex items-center gap-2 px-3 py-2 text-xs leading-snug border ${isOwn ? "bg-cr-primary text-black border-black hover:bg-yellow-300" : "bg-cr-surface border-cr-border text-cr-text hover:bg-cr-surface-2"} transition-colors`,
      children: [
        /* @__PURE__ */ jsx(MapPin, { size: 13, className: "flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono", children: valid ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : body }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-60", children: "Ver mapa ↗" })
      ]
    }
  );
}
function PhotoBubble({ url, isOwn }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: `block overflow-hidden border-2 ${isOwn ? "border-cr-primary" : "border-cr-border"}`,
        "aria-label": "Ver foto en tamaño completo",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: url,
            alt: "Foto del punto de encuentro",
            className: "max-w-[200px] max-h-[150px] object-cover",
            loading: "lazy"
          }
        )
      }
    ),
    open && /* @__PURE__ */ jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4",
        onClick: () => setOpen(false),
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "absolute top-4 right-4 text-white",
              onClick: () => setOpen(false),
              "aria-label": "Cerrar",
              children: /* @__PURE__ */ jsx(X, { size: 24 })
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: url,
              alt: "Foto del punto de encuentro",
              className: "max-w-full max-h-full object-contain",
              onClick: (e) => e.stopPropagation()
            }
          )
        ]
      }
    )
  ] });
}
function TextBubble({ body, isOwn }) {
  const urls = detectUrls(body);
  return /* @__PURE__ */ jsxs("div", { className: `px-3 py-2 text-xs leading-snug break-words ${isOwn ? "bg-cr-primary text-black" : "bg-cr-surface border border-cr-border text-cr-text"}`, children: [
    /* @__PURE__ */ jsx("p", { children: body }),
    urls.map((u) => /* @__PURE__ */ jsx(LinkPreview, { url: u }, u))
  ] });
}
function ChatPanel({ messages, loading, forbidden, currentUserId, onSend }) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [pending, setPending] = useState(null);
  const [locating, setLocating] = useState(false);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  useEffect(() => {
    var _a2;
    (_a2 = bottomRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  function pickPhoto() {
    var _a2;
    (_a2 = fileRef.current) == null ? void 0 : _a2.click();
  }
  function onFileChange(e) {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPending({ kind: "photo", file, previewUrl });
    e.target.value = "";
  }
  function shareLocation() {
    if (!navigator.geolocation) {
      setSendError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setPending({ kind: "location", lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setSendError("No se pudo obtener tu ubicación.");
      },
      { timeout: 1e4 }
    );
  }
  function clearPending() {
    if ((pending == null ? void 0 : pending.kind) === "photo") URL.revokeObjectURL(pending.previewUrl);
    setPending(null);
  }
  async function handleSend(e) {
    e.preventDefault();
    if (sending) return;
    if (!pending && !draft.trim()) return;
    setSending(true);
    setSendError("");
    try {
      if ((pending == null ? void 0 : pending.kind) === "photo") {
        const { url } = await api.messages.uploadPhoto(pending.file);
        URL.revokeObjectURL(pending.previewUrl);
        await onSend(draft.trim() || "📷 Foto", "photo", url);
      } else if ((pending == null ? void 0 : pending.kind) === "location") {
        await onSend(`${pending.lat},${pending.lng}`, "location");
      } else {
        await onSend(draft.trim(), "text");
      }
      setDraft("");
      setPending(null);
    } catch {
      setSendError("No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }
  if (forbidden) {
    return /* @__PURE__ */ jsx("div", { className: "border border-dashed border-cr-border p-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-dim", children: "Solo los viajeros confirmados pueden ver este chat." }) });
  }
  const canSend = !sending && (!!draft.trim() || !!pending);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col border border-cr-border bg-cr-surface", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-1 max-h-80 overflow-y-auto p-4 space-y-3 bg-cr-bg font-mono text-xs", children: [
      loading && /* @__PURE__ */ jsx("p", { className: "text-cr-text-dim animate-pulse", children: "Cargando mensajes…" }),
      !loading && messages.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-cr-text-dim", children: "Nadie ha escrito todavía. Sé el primero." }),
      messages.map((msg) => {
        const isOwn = msg.user_id === currentUserId;
        return /* @__PURE__ */ jsxs("div", { className: `flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": "true",
              className: "w-7 h-7 flex-shrink-0 bg-cr-surface-2 border border-cr-border flex items-center justify-center text-[10px] text-cr-primary font-display",
              children: initials(msg.user.name)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: `max-w-[75%] space-y-0.5 ${isOwn ? "items-end" : "items-start"} flex flex-col`, children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-baseline gap-2 ${isOwn ? "flex-row-reverse" : ""}`, children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-cr-text-muted", children: isOwn ? "Tú" : msg.user.name }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-cr-text-dim", children: formatTime(msg.created_at) })
            ] }),
            msg.kind === "location" ? /* @__PURE__ */ jsx(LocationBubble, { body: msg.body, isOwn }) : msg.kind === "photo" && msg.attachment_url ? /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(PhotoBubble, { url: msg.attachment_url, isOwn }),
              msg.body && msg.body !== "📷 Foto" && /* @__PURE__ */ jsx("p", { className: `px-3 py-1 text-xs ${isOwn ? "bg-cr-primary text-black" : "bg-cr-surface border border-cr-border text-cr-text"}`, children: msg.body })
            ] }) : /* @__PURE__ */ jsx(TextBubble, { body: msg.body, isOwn })
          ] })
        ] }, msg.id);
      }),
      /* @__PURE__ */ jsx("div", { ref: bottomRef })
    ] }),
    pending && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-t border-cr-border bg-cr-surface-2 px-3 py-2", children: [
      pending.kind === "photo" && /* @__PURE__ */ jsx("img", { src: pending.previewUrl, alt: "preview", className: "h-10 w-10 object-cover border border-cr-border" }),
      pending.kind === "location" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-mono text-[10px] text-cr-primary", children: [
        /* @__PURE__ */ jsx(MapPin, { size: 12 }),
        /* @__PURE__ */ jsxs("span", { children: [
          pending.lat.toFixed(4),
          ", ",
          pending.lng.toFixed(4)
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: clearPending,
          className: "ml-auto text-cr-text-dim hover:text-cr-secondary transition-colors",
          "aria-label": "Eliminar adjunto",
          children: /* @__PURE__ */ jsx(X, { size: 14 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSend, className: "flex items-center gap-2 border-t border-cr-border p-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/gif",
          className: "hidden",
          onChange: onFileChange
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: shareLocation,
          disabled: sending || locating,
          title: "Compartir ubicación",
          "aria-label": "Compartir ubicación",
          className: "flex-shrink-0 flex items-center justify-center w-8 h-8 border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors disabled:opacity-40 disabled:pointer-events-none",
          children: /* @__PURE__ */ jsx(MapPin, { size: 13, className: locating ? "animate-pulse text-cr-primary" : "" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: pickPhoto,
          disabled: sending,
          title: "Adjuntar foto",
          "aria-label": "Adjuntar foto",
          className: "flex-shrink-0 flex items-center justify-center w-8 h-8 border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors disabled:opacity-40 disabled:pointer-events-none",
          children: /* @__PURE__ */ jsx(Paperclip, { size: 13 })
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: draft,
          onChange: (e) => setDraft(e.target.value.slice(0, 280)),
          placeholder: (pending == null ? void 0 : pending.kind) === "location" ? "Añade un comentario (opcional)…" : (pending == null ? void 0 : pending.kind) === "photo" ? "Describe la foto (opcional)…" : "Escribe un mensaje…",
          disabled: sending,
          className: "flex-1 bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary transition-colors"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: !canSend,
          "aria-label": "Enviar mensaje",
          className: "flex items-center justify-center w-9 h-9 bg-cr-primary text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none",
          children: /* @__PURE__ */ jsx(Send, { size: 14 })
        }
      )
    ] }),
    sendError && /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-cr-secondary px-3 pb-2", children: sendError })
  ] });
}
const POLL_MS = 5e3;
const MAX_BACKOFF_MS = 6e4;
function ConcertChatSection({ concertId, artist }) {
  const { user } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const backoffRef = useRef(POLL_MS);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);
  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.messages.listConcertChat(concertId);
      setMessages(res.messages);
      setForbidden(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setForbidden(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [concertId, user]);
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    mountedRef.current = true;
    backoffRef.current = POLL_MS;
    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        if (!mountedRef.current || document.hidden) {
          backoffRef.current = POLL_MS;
          schedule();
          return;
        }
        try {
          await fetchMessages();
          backoffRef.current = POLL_MS;
        } catch {
          backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS);
        }
        if (mountedRef.current) schedule();
      }, backoffRef.current);
    };
    void fetchMessages();
    schedule();
    const onVisible = () => {
      if (!document.hidden && mountedRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        backoffRef.current = POLL_MS;
        void fetchMessages();
        schedule();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchMessages, user]);
  async function send(body, kind, attachment_url) {
    const msg = await api.messages.postConcertChat(concertId, { body, kind, attachment_url });
    setMessages((prev) => [...prev, msg]);
  }
  return /* @__PURE__ */ jsxs("section", { "aria-labelledby": "concert-chat-title", className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-baseline justify-between gap-3", children: [
      /* @__PURE__ */ jsx("h2", { id: "concert-chat-title", className: "font-display text-sm uppercase tracking-wide text-cr-text-muted", children: "Chat del concierto" }),
      /* @__PURE__ */ jsx("span", { className: "font-mono text-[10px] text-cr-text-dim uppercase", children: "Abierto a todos los fans" })
    ] }),
    !user ? /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-6 text-center space-y-3", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
        "Inicia sesión para unirte al chat con otros fans de ",
        artist,
        "."
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: `/login?next=${encodeURIComponent(`/concerts/${concertId}`)}`,
          className: "inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-5 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100",
          children: "Entrar"
        }
      )
    ] }) : /* @__PURE__ */ jsx(
      ChatPanel,
      {
        messages,
        loading,
        forbidden,
        currentUserId: user.id,
        onSend: (body, kind, attachment_url) => send(body, kind, attachment_url)
      }
    )
  ] });
}
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function hueFromString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return Math.abs(h) % 360;
}
function ConcertDetailPage() {
  const { id: id2 } = useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const [concert, setConcert] = useState(null);
  const [rides, setRides] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [error, setError] = useState(null);
  const [demand, setDemand] = useState(null);
  const [demandLoading, setDemandLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  useSeoMeta({
    title: concert ? `Viajes a ${concert.artist} en ${concert.venue.name} — ConcertRide ES` : "Concierto — ConcertRide ES",
    description: concert ? `Viaje compartido para ver a ${concert.artist} en ${concert.venue.name} (${concert.venue.city}). Carpooling desde cualquier ciudad, sin comisión, conductores verificados. Divide el coste con otros fans.` : "Encuentra un viaje compartido para ir al concierto en España.",
    canonical: id2 ? `${SITE_URL}/concerts/${id2}` : void 0,
    keywords: concert ? `${concert.artist}, cómo ir a ${concert.artist}, viaje compartido ${concert.artist}, carpooling ${concert.venue.city}, transporte ${concert.artist} ${concert.venue.city}, coche compartido ${concert.venue.name}, concierto ${concert.venue.city} 2026, ${concert.genre ?? "conciertos"} España, compartir coche ${concert.venue.city}` : void 0,
    ogImage: (concert == null ? void 0 : concert.image_url) ?? void 0
  });
  useEffect(() => {
    if (!id2) return;
    setConcert(null);
    setRides(null);
    setError(null);
    Promise.all([api.concerts.get(id2), api.rides.list({ concert_id: id2 })]).then(([c, r]) => {
      setConcert(c);
      setRides(r.rides);
    }).catch((err) => {
      if (err instanceof ApiError && err.status === 404) setError("concert_not_found");
      else setError("load_failed");
    });
    api.concerts.getInterest(id2).then(setDemand).catch(() => {
    });
  }, [id2]);
  const cities = useMemo(() => {
    if (!rides) return [];
    return Array.from(new Set(rides.map((r) => r.origin_city))).sort();
  }, [rides]);
  const visible = useMemo(() => {
    if (!rides) return [];
    return rides.filter((r) => {
      if (filters.origin_city && r.origin_city !== filters.origin_city) return false;
      if (filters.max_price && r.price_per_seat > Number(filters.max_price)) return false;
      if (filters.vibe && r.vibe !== filters.vibe) return false;
      if (filters.round_trip === "yes" && !r.round_trip) return false;
      if (filters.round_trip === "no" && r.round_trip) return false;
      if (filters.near_lat !== null && filters.near_lng !== null) {
        const dist = haversineKm(filters.near_lat, filters.near_lng, r.origin_lat, r.origin_lng);
        if (dist > filters.radius_km) return false;
      }
      if (filters.no_smoking && r.smoking_policy !== "no") return false;
      return true;
    });
  }, [rides, filters]);
  if (error === "concert_not_found") {
    return /* @__PURE__ */ jsx("main", { className: "min-h-dvh flex items-center justify-center px-6 bg-cr-bg", children: /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 max-w-md", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary", children: "404" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl uppercase", children: "Concierto no encontrado" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted", children: "Igual se agotó o nunca existió. Vuelve al directorio." }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary pb-0.5",
          children: "← Volver al inicio"
        }
      )
    ] }) });
  }
  const hue = concert ? hueFromString(concert.artist) : 0;
  const isPast = concert ? concertStatus(concert.date) !== "upcoming" : false;
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "bg-cr-bg text-cr-text min-h-dvh", children: [
    concert && /* @__PURE__ */ jsx(JsonLdEvent, { concert }),
    concert && /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
              { "@type": "ListItem", position: 3, name: concert.artist, item: `${SITE_URL}/concerts/${concert.id}` }
            ]
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs(
      "section",
      {
        className: "relative overflow-hidden border-b border-cr-border min-h-[280px] md:min-h-[360px]",
        style: {
          background: concert && !concert.image_url ? void 0 : (concert == null ? void 0 : concert.image_url) ? "#080808" : `radial-gradient(circle at 30% 20%, hsl(${hue} 60% 10%), #080808 70%)`
        },
        children: [
          concert && !concert.image_url && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: "absolute inset-0 opacity-70", children: /* @__PURE__ */ jsx(ConcertPoster, { concert }) }),
          (concert == null ? void 0 : concert.image_url) && /* @__PURE__ */ jsx(
            "img",
            {
              src: concert.image_url,
              alt: "",
              className: "absolute inset-0 w-full h-full object-cover opacity-30"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none bg-gradient-to-t from-cr-bg via-cr-bg/70 to-cr-bg/30" }),
          /* @__PURE__ */ jsxs("div", { className: "relative max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => navigate(-1),
                  className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
                    " Volver"
                  ]
                }
              ),
              concert && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const campaign = concert.artist.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
                      const url = concertShareUrl(concert.id, campaign, "whatsapp");
                      const text = `🎶 ${concert.artist} en ${concert.venue.city}. ¿Nos organizamos un viaje? ${url}`;
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(text)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    },
                    title: "Compartir por WhatsApp",
                    className: "inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
                    children: [
                      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "💬" }),
                      " WhatsApp"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const campaign = concert.artist.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
                      const url = concertShareUrl(concert.id, campaign, "copy");
                      navigator.clipboard.writeText(url).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2e3);
                      });
                    },
                    className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
                    children: [
                      /* @__PURE__ */ jsx(Link2, { size: 14, "aria-hidden": "true" }),
                      copied ? "¡Copiado!" : "Copiar enlace"
                    ]
                  }
                )
              ] })
            ] }),
            concert ? /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4 },
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: [
                    "Concierto · ",
                    concert.genre ?? "Música en vivo"
                  ] }),
                  /* @__PURE__ */ jsx("h1", { className: "font-display uppercase text-4xl md:text-7xl leading-[0.95]", children: concert.artist }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-cr-text-muted", children: [
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(MapPin, { size: 12, "aria-hidden": "true" }),
                      concert.venue.name,
                      " · ",
                      concert.venue.city
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(Calendar, { size: 12, "aria-hidden": "true" }),
                      formatDate(concert.date),
                      " · ",
                      formatTime$1(concert.date)
                    ] }),
                    concert.price_min !== null && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(Music2, { size: 12, "aria-hidden": "true" }),
                      "Entradas desde €",
                      concert.price_min
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
                    /* @__PURE__ */ jsx(
                      FavoriteButton,
                      {
                        kind: "concert",
                        targetId: concert.id,
                        label: `${concert.artist} — ${concert.venue.city}`,
                        variant: "pill",
                        promptLoginOnAnon: true
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      FavoriteButton,
                      {
                        kind: "artist",
                        targetId: concert.artist,
                        label: concert.artist,
                        variant: "pill",
                        promptLoginOnAnon: true,
                        className: "!text-[11px]"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      FavoriteButton,
                      {
                        kind: "city",
                        targetId: concert.venue.city,
                        label: concert.venue.city,
                        variant: "pill",
                        promptLoginOnAnon: true
                      }
                    )
                  ] }),
                  concert.lineup && /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-1", children: "Cartel" }),
                    /* @__PURE__ */ jsx("p", { className: "font-mono text-sm text-cr-text leading-relaxed", children: concert.lineup })
                  ] }),
                  (concert.official_url || concert.ticketmaster_url) && /* @__PURE__ */ jsxs("div", { className: "pt-1 flex flex-wrap gap-2", children: [
                    concert.official_url && /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: concert.official_url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 border-cr-primary text-cr-primary hover:bg-cr-primary/10 px-3 py-1.5 transition-colors",
                        children: "Web oficial / entradas →"
                      }
                    ),
                    concert.ticketmaster_url && /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: concert.ticketmaster_url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-3 py-1.5 transition-colors",
                        children: [
                          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-[10px] font-mono text-cr-text-dim", children: "TM" }),
                          "Ticketmaster →"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsx("div", { className: "h-24 w-3/4 bg-cr-surface-2 cr-shimmer" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(FilterBar, { value: filters, onChange: setFilters, cities }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 py-10 space-y-6", children: [
      demand !== null && !isPast && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 border border-dashed border-cr-border p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Users, { size: 16, className: "text-cr-primary", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("p", { className: "font-mono text-sm text-cr-text", children: demand.count > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-semibold", children: demand.count }),
            " ",
            "persona",
            demand.count === 1 ? "" : "s",
            " busca",
            demand.count === 1 ? "" : "n",
            " viaje"
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: "Nadie busca viaje todavía" }) })
        ] }),
        user ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            disabled: demandLoading,
            onClick: async () => {
              setDemandLoading(true);
              try {
                const updated = await api.concerts.toggleInterest(id2);
                setDemand(updated);
              } finally {
                setDemandLoading(false);
              }
            },
            className: `font-sans text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 border-2 transition-colors disabled:opacity-40 ${demand.user_has_signaled ? "border-cr-primary bg-cr-primary text-black" : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"}`,
            children: demandLoading ? "…" : demand.user_has_signaled ? "Apuntado" : "Necesito un viaje"
          }
        ) : /* @__PURE__ */ jsx(
          Link,
          {
            to: `/login?next=${encodeURIComponent(`/concerts/${id2}`)}`,
            className: "font-sans text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 border-2 border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors",
            children: "Necesito un viaje"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("header", { className: "flex items-baseline justify-between gap-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase tracking-wide", children: isPast ? "Viajes realizados" : "Viajes disponibles" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted", children: rides ? `${visible.length} / ${rides.length}` : "…" })
      ] }),
      !rides && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(TicketCardSkeleton, {}),
        /* @__PURE__ */ jsx(TicketCardSkeleton, {}),
        /* @__PURE__ */ jsx(TicketCardSkeleton, {})
      ] }),
      rides && visible.length === 0 && /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-10 text-center space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase", children: rides.length === 0 ? isPast ? "No se publicaron viajes para este concierto." : "Nadie ha publicado viajes todavía." : "Ningún viaje cumple los filtros." }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted", children: rides.length === 0 ? isPast ? "Este concierto ya tuvo lugar." : "Sé el primero en abrir tu coche. Divide el coste y llena el viaje." : "Prueba a relajar el precio máximo o la ciudad de origen." }),
        rides.length === 0 && !isPast && /* @__PURE__ */ jsx(
          Link,
          {
            to: `/publish?concert=${concert.id}`,
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100",
            children: "Publicar un viaje"
          }
        )
      ] }),
      rides && visible.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          motion.ol,
          {
            initial: "hidden",
            animate: "show",
            variants: {
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
            },
            className: "grid grid-cols-1 xl:grid-cols-2 gap-4",
            children: visible.map((ride) => /* @__PURE__ */ jsx(
              motion.li,
              {
                variants: {
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                },
                children: /* @__PURE__ */ jsx(
                  TicketCard,
                  {
                    ride,
                    onClick: () => navigate(`/rides/${ride.id}`)
                  }
                )
              },
              ride.id
            ))
          }
        ),
        isPast && /* @__PURE__ */ jsxs("div", { className: "border border-cr-primary/30 bg-cr-primary/[0.04] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Star, { size: 12, "aria-hidden": "true" }),
              "¿Fuiste a este concierto?"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted", children: "Entra en tu viaje y valora al conductor." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            visible.slice(0, 3).map((ride) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/rides/${ride.id}`,
                className: "inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-primary text-cr-primary px-3 py-2 hover:bg-cr-primary hover:text-black transition-colors",
                children: [
                  "Desde ",
                  ride.origin_city
                ]
              },
              ride.id
            )),
            visible.length > 3 && /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs text-cr-text-muted self-center", children: [
              "+",
              visible.length - 3,
              " más"
            ] })
          ] })
        ] })
      ] })
    ] }),
    concert && !isPast && /* @__PURE__ */ jsx("section", { className: "max-w-6xl mx-auto px-6 pb-16", children: /* @__PURE__ */ jsx(ConcertChatSection, { concertId: concert.id, artist: concert.artist }) }),
    concert && !isPast && /* @__PURE__ */ jsx("section", { className: "max-w-6xl mx-auto px-6 pb-16", children: /* @__PURE__ */ jsx(EmbedSnippet, { concertId: concert.id }) })
  ] });
}
function EmbedSnippet({ concertId }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const snippet = `<iframe
  src="${SITE_URL}/widget/concert/${concertId}"
  width="100%"
  height="320"
  frameborder="0"
  style="border-radius:4px;"
  title="Viajes compartidos — ConcertRide"
></iframe>`;
  if (!open) {
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-dim hover:text-cr-text-muted transition-colors",
        children: "¿Eres promotora? Incrusta los viajes en tu web →"
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-5 space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted", children: "Widget para tu web" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-cr-text-dim mt-1", children: "Copia este código HTML en tu web para mostrar los viajes disponibles en tiempo real." })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setOpen(false),
          className: "font-mono text-[11px] text-cr-text-dim hover:text-cr-text transition-colors",
          "aria-label": "Cerrar",
          children: "✕"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("pre", { className: "bg-cr-surface border border-cr-border p-3 font-mono text-[11px] text-cr-text-muted overflow-x-auto whitespace-pre-wrap break-all", children: snippet }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          navigator.clipboard.writeText(snippet).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2e3);
          });
        },
        className: "font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-4 py-2 transition-colors",
        children: copied ? "¡Copiado!" : "Copiar snippet"
      }
    )
  ] });
}
function JsonLdEvent({ concert }) {
  const startMs = new Date(concert.date).getTime();
  const endDate = Number.isFinite(startMs) ? new Date(startMs + 3 * 60 * 60 * 1e3).toISOString() : void 0;
  const url = `${SITE_URL}/concerts/${concert.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: concert.name,
    url,
    description: `Concierto de ${concert.artist} en ${concert.venue.name} (${concert.venue.city}). Encuentra viajes compartidos desde toda España en ConcertRide.`,
    performer: {
      "@type": "MusicGroup",
      name: concert.artist
    },
    organizer: {
      "@type": "Organization",
      name: "ConcertRide ES",
      url: `${SITE_URL}/`
    },
    startDate: concert.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: concert.venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: concert.venue.city,
        addressCountry: "ES",
        streetAddress: concert.venue.address
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: concert.venue.lat,
        longitude: concert.venue.lng
      }
    }
  };
  if (endDate) jsonLd.endDate = endDate;
  if (concert.image_url) jsonLd.image = [concert.image_url];
  if (concert.price_min !== null) {
    jsonLd.offers = {
      "@type": "Offer",
      price: String(concert.price_min),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: concert.official_url ?? concert.ticketmaster_url ?? url,
      validFrom: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  return /* @__PURE__ */ jsx(
    "script",
    {
      type: "application/ld+json",
      dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
    }
  );
}
const CITY_LANDINGS = [
  {
    slug: "madrid",
    city: "Madrid",
    display: "Madrid",
    region: "Comunidad de Madrid",
    blurb: "Madrid concentra la mayor parte de la actividad de conciertos y festivales de España. WiZink Center, Palacio Vistalegre, Caja Mágica e IFEMA (sede de Mad Cool) acogen cada año giras internacionales y festivales de referencia. ConcertRide conecta a fans desde toda España que quieren llegar al concierto sin depender de transporte público nocturno o taxis caros.",
    venues: [
      "WiZink Center",
      "Palacio Vistalegre",
      "Caja Mágica",
      "IFEMA (Mad Cool Festival)",
      "Coca-Cola Music Experience"
    ],
    lat: 40.4168,
    lng: -3.7038
  },
  {
    slug: "barcelona",
    city: "Barcelona",
    display: "Barcelona",
    region: "Cataluña",
    blurb: "Barcelona es la capital europea de los festivales de música electrónica e indie. Palau Sant Jordi, Parc del Fòrum (Primavera Sound, Cruïlla) y Fira Montjuïc (Sónar) son los tres epicentros. ConcertRide permite llegar a estos recintos desde Zaragoza, Valencia, Lleida y otras ciudades sin pagar taxi.",
    venues: [
      "Palau Sant Jordi",
      "Parc del Fòrum (Primavera Sound / Cruïlla)",
      "Fira Montjuïc (Sónar)",
      "Palau Blaugrana"
    ],
    lat: 41.3851,
    lng: 2.1734
  },
  {
    slug: "valencia",
    city: "Valencia",
    display: "Valencia",
    region: "Comunidad Valenciana",
    blurb: "Valencia ciudad acoge Zevra Festival (Marina de València) y conciertos urbanos frecuentes. Su provincia es una de las más densas en festivales: Arenal Sound en Burriana, Iboga Summer en Tavernes, Medusa en Cullera, Riverland en Bétera y SanSan/FIB en Benicàssim, todos accesibles en coche desde la ciudad.",
    venues: [
      "Zevra Festival (La Marina)",
      "Arenal Sound (Burriana)",
      "Medusa Festival (Cullera)",
      "Iboga Summer (Tavernes)"
    ],
    lat: 39.4699,
    lng: -0.3763
  },
  {
    slug: "sevilla",
    city: "Sevilla",
    display: "Sevilla",
    region: "Andalucía",
    blurb: "Sevilla concentra los conciertos más grandes de Andalucía en 2026. El Estadio La Cartuja acoge giras de estadio (aforo 60.000), FIBES Sevilla alberga tours mid-size y el Palacio de los Deportes San Pablo cubre el circuito indoor. Interestelar Sevilla se celebra cada verano en el Charco de la Pava. La cercanía con los festivales de Málaga (Cala Mijas, 200 km) y Huelva hace que Sevilla sea un punto de origen habitual para viajes compartidos a festivales andaluces. ConcertRide conecta a asistentes de Sevilla con conductores de toda España para llegar a cualquier concierto o festival sin depender de transporte público nocturno.",
    venues: [
      "Estadio La Cartuja",
      "FIBES Sevilla",
      "Palacio de los Deportes San Pablo",
      "Interestelar Sevilla (Charco de la Pava)",
      "Teatro de la Maestranza"
    ],
    lat: 37.3891,
    lng: -5.9845
  },
  {
    slug: "bilbao",
    city: "Bilbao",
    display: "Bilbao",
    region: "País Vasco",
    blurb: "Bilbao es referencia para festivales internacionales del norte: BBK Live en Kobetamendi cada julio, y Bilbao Arena para tours indoor. La proximidad con Donostia (Jazzaldia) y la cornisa cantábrica hace que el carpooling sea la forma natural de moverse por los festivales del verano vasco.",
    venues: ["Kobetamendi (BBK Live)", "Bilbao Arena"],
    lat: 43.263,
    lng: -2.935
  },
  {
    slug: "malaga",
    city: "Málaga",
    display: "Málaga",
    region: "Andalucía",
    blurb: "Málaga concentra los festivales más solares de España: Cala Mijas (Mijas), Andalucía Big (Cortijo de Torres), Marenostrum (Castillo Sohail de Fuengirola). La Costa del Sol es densa en eventos pero el transporte público es limitado — el coche compartido es la opción por defecto.",
    venues: ["Cala Mijas Fest", "Andalucía Big Festival", "Marenostrum Music Castle"],
    lat: 36.7213,
    lng: -4.4217
  },
  {
    slug: "zaragoza",
    city: "Zaragoza",
    display: "Zaragoza",
    region: "Aragón",
    blurb: "Zaragoza es nodo estratégico por su ubicación equidistante entre Madrid y Barcelona. Además de conciertos en el Príncipe Felipe, es origen natural para viajes a Pirineos Sur (Lanuza), Primavera Sound (Barcelona) y Mad Cool (Madrid).",
    venues: ["Pabellón Príncipe Felipe", "Pirineos Sur (Lanuza)"],
    lat: 41.6488,
    lng: -0.8891
  },
  {
    slug: "granada",
    city: "Granada",
    display: "Granada",
    region: "Andalucía",
    blurb: "Granada acoge Granada Sound en septiembre (Cortijo del Conde) y conciertos independientes durante todo el año. Origen frecuente para viajes a festivales andaluces del verano: Cala Mijas, Andalucía Big, Interestelar Sevilla.",
    venues: ["Granada Sound (Cortijo del Conde)"],
    lat: 37.1773,
    lng: -3.5986
  },
  {
    slug: "donostia",
    city: "Donostia / San Sebastián",
    display: "Donostia / San Sebastián",
    region: "País Vasco",
    blurb: "Donostia destaca por Heineken Jazzaldia en julio (Plaza de la Trinidad, Kursaal) y una agenda indie densa en salas pequeñas. Cercanía con BBK Live y Azkena Rock hace que muchos viajes compartidos salgan de aquí en verano.",
    venues: ["Plaza de la Trinidad", "Kursaal", "Heineken Jazzaldia"],
    lat: 43.3183,
    lng: -1.9812
  },
  {
    slug: "santiago-de-compostela",
    city: "Santiago de Compostela",
    display: "Santiago de Compostela",
    region: "Galicia",
    blurb: "Santiago acoge O Son do Camiño en Monte do Gozo cada junio, uno de los festivales con mayor aforo de España (90 000+ personas). ConcertRide es especialmente útil para gallegos que viven en aldeas sin transporte directo al recinto.",
    venues: ["Monte do Gozo (O Son do Camiño)"],
    lat: 42.8782,
    lng: -8.5448
  }
];
const CITY_LANDINGS_BY_SLUG = Object.fromEntries(
  CITY_LANDINGS.map((c) => [c.slug, c])
);
const FESTIVAL_LANDINGS = [
  {
    slug: "mad-cool",
    name: "Mad Cool Festival",
    shortName: "Mad Cool",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "IFEMA Madrid",
    venueAddress: "Av. del Partenón, 5, 28042 Madrid",
    lat: 40.464,
    lng: -3.61,
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    typicalDates: "Primera quincena de julio (edición 2026: 9–11 julio)",
    capacity: "80.000 personas/día",
    blurb: "Mad Cool es el festival de rock e indie alternativo más grande de Madrid, celebrado en IFEMA desde 2016. Convoca a 80.000 asistentes diarios con artistas internacionales de primera línea. El recinto queda a 15 km del centro de Madrid pero está mal comunicado en transporte público pasada la medianoche: el último metro (línea 8) cierra a la 1:30 y los autobuses nocturnos N1 y N6 no llegan a IFEMA directamente. Según la APM, Mad Cool fue uno de los festivales con mayor afluencia internacional de España en 2024. El coche compartido a través de ConcertRide es la opción preferida de quienes vienen desde otras provincias o desde barrios sin acceso directo a IFEMA.",
    originCities: [
      { city: "Centro de Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Segovia", km: 90, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Mad Cool desde el centro de Madrid?",
        a: "En metro, la línea 8 (dirección Aeropuerto T4) llega a IFEMA en la estación 'Feria de Madrid' (unos 25 minutos desde Sol). Sin embargo, en noches de festival el metro se satura a la salida (1:00–2:00) y las colas llegan al exterior del recinto. Con ConcertRide puedes coordinar la vuelta con otros asistentes y evitar la aglomeración, pagando entre 4 y 7 € por plaza."
      },
      {
        q: "¿Hay transporte público nocturno de vuelta de Mad Cool?",
        a: "El metro cierra sobre la 1:30 (se amplía hasta las 2:00–2:30 en noches de Mad Cool). Los autobuses nocturnos N1 y N6 cubren la Avenida de América y Canillejas pero no paran en IFEMA directamente. La alternativa más habitual es taxi o VTC (60–90 € de media, con precio multiplicado x2–x3 en horario de alta demanda) o carpooling con ConcertRide (4–7 € desde Madrid centro, 10–14 € desde Valencia, 9–13 € desde Zaragoza)."
      },
      {
        q: "¿Cuánto cuesta ir a Mad Cool desde Barcelona en coche compartido?",
        a: "La distancia Madrid–Barcelona es de unos 620 km (5h 30 min). Con ConcertRide, el precio típico por asiento oscila entre 15 y 20 €, frente a los 50–70 € de un billete de AVE o los 180–220 € de alquiler de coche solo. Es habitual que fans de Barcelona organicen el viaje redondo y se queden en Madrid el fin de semana del festival."
      },
      {
        q: "¿Puedo aparcar en IFEMA durante Mad Cool?",
        a: "IFEMA tiene varias zonas de parking de pago (12–18 €/día), pero los accesos por la R-2 y M-14 colapsan desde las 18:00 en días de festival. La mayoría de conductores de fuera de Madrid prefieren aparcar en la zona del intercambiador de Avenida de América o en Barajas, y tomar la línea 8 desde allí. Con ConcertRide puedes llegar directamente al festival sin problema de parking."
      },
      {
        q: "¿Hay lanzadera oficial de Mad Cool desde el centro de Madrid?",
        a: "Mad Cool no opera lanzaderas propias desde el centro de Madrid (a diferencia de algunos festivales como BBK Live). La Metro Línea 8 es el único transporte oficial directo. Los shuttles privados que aparecen en redes sociales son iniciativas no oficiales. ConcertRide es la alternativa organizada más fiable para asistentes de otras ciudades."
      },
      {
        q: "¿Cuándo se celebra Mad Cool 2026?",
        a: "La edición 2026 de Mad Cool Festival está prevista para el 9, 10 y 11 de julio en IFEMA Madrid. Puedes buscar viajes disponibles para esas fechas en concertride.me."
      }
    ],
    relatedFestivals: ["tomavistas", "sonorama-ribera"]
  },
  {
    slug: "primavera-sound",
    name: "Primavera Sound Barcelona",
    shortName: "Primavera Sound",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    venue: "Parc del Fòrum",
    venueAddress: "Rambla del Prim, 2-4, 08019 Barcelona",
    lat: 41.4066,
    lng: 2.2218,
    startDate: "2026-05-28",
    endDate: "2026-06-01",
    typicalDates: "Última semana de mayo / primera de junio (edición 2026: 28 mayo–1 junio)",
    capacity: "60.000 personas/día",
    blurb: "Primavera Sound es el festival de indie y alternativo más influyente de Europa, celebrado cada año en el Parc del Fòrum de Barcelona desde 2001. Atrae asistentes de toda España y de más de 80 países, con más de 60.000 asistentes diarios en su recinto de Sant Adrià de Besòs. El metro L4 (Besòs Mar) llega al Fòrum pero se colapsa en las salidas de madrugada, con colas de 30–45 minutos habituales. Los asientos de AVE desde Madrid (50–100 €) se agotan semanas antes del festival. Viajar en coche compartido desde Madrid (15–20 €), Valencia (10–14 €) o Zaragoza (8–12 €) es la opción más popular y económica para asistentes de fuera de Cataluña.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Primavera Sound desde Madrid?",
        a: "El trayecto Madrid–Barcelona son unos 620 km (5–6 horas en coche). El AVE cuesta entre 50 y 100 € y requiere transporte adicional hasta el Parc del Fòrum. Con ConcertRide puedes encontrar un viaje compartido por 15–20 € por asiento, salir desde cualquier punto de Madrid y llegar directamente al Fòrum. Es habitual que los fans madrileños busquen viaje de 5 días y busquen alojamiento en Barcelona para toda la semana del festival."
      },
      {
        q: "¿Qué metro o transporte hay durante Primavera Sound?",
        a: "El metro de Barcelona línea L4 (parada Besòs Mar) está a 10 minutos a pie del recinto del Fòrum. En noches de festival TMB amplía el servicio hasta las 3:00–4:00. El Bus Nocturn N6 y N7 complementan la red nocturna. Sin embargo, las salidas de madrugada se colapsan: colas de 30–45 minutos son habituales. Muchos asistentes coordinan su vuelta a sus ciudades de origen con ConcertRide para evitar la aglomeración."
      },
      {
        q: "¿Cuánto cuesta ir a Primavera Sound desde Valencia?",
        a: "La distancia Valencia–Barcelona (Fòrum) es de unos 355 km (3h 15 min en coche). Por ConcertRide, el precio por asiento suele estar entre 10 y 14 €. El tren AVE Valencia–Barcelona cuesta entre 20 y 60 € pero no llega al recinto; hay que tomar metro o taxi adicional desde la Estació de Sants (unos 30 minutos más)."
      },
      {
        q: "¿Hay parking en el Parc del Fòrum para Primavera Sound?",
        a: "El parking del Parc del Fòrum y Sant Adrià de Besòs es muy limitado durante el festival (máximo 500 plazas, 25–35 €/día). La organización desaconseja venir en coche particular al recinto. Lo más habitual para quienes vienen de fuera de Barcelona es aparcar en el área metropolitana (Badalona, Sant Adrià) y tomar el metro L4, o llegar directamente con conductor de ConcertRide."
      },
      {
        q: "¿Hay shuttle oficial de Primavera Sound?",
        a: "Primavera Sound no opera un shuttle oficial de larga distancia desde otras ciudades. Algunos organizadores privados ofrecen autobuses desde Madrid (30–50 €) con plazas limitadas. ConcertRide es la alternativa más flexible: puedes elegir tu ciudad de origen, la hora de salida y acordar la vuelta cuando acabe el último bolo."
      },
      {
        q: "¿En qué fechas es Primavera Sound 2026?",
        a: "Primavera Sound 2026 está previsto para el 28 de mayo al 1 de junio en el Parc del Fòrum de Barcelona. Busca viajes en concertride.me para esas fechas."
      }
    ],
    relatedFestivals: ["sonar", "cruilla"]
  },
  {
    slug: "sonar",
    name: "Sónar Barcelona",
    shortName: "Sónar",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    venue: "Fira Gran Via (Sónar by Night) + Fira Montjuïc (Sónar by Day)",
    venueAddress: "Av. Joan Carles I, 64, 08908 L'Hospitalet de Llobregat",
    lat: 41.3561,
    lng: 2.1302,
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    typicalDates: "Tercera semana de junio (edición 2026: 18–20 junio)",
    capacity: "120.000 personas (edición completa)",
    blurb: "Sónar es el festival internacional de música avanzada, creatividad y tecnología más reconocido del mundo, celebrado en Barcelona desde 1994. Funciona en dos sedes simultáneas: Sónar by Day en Fira Montjuïc (Gran Via de les Corts Catalanes, Montjuïc) y Sónar by Night en Fira Gran Via de L'Hospitalet de Llobregat, a 8 km del centro de Barcelona. El festival atrae cada año a más de 120.000 asistentes de más de 100 países y es referencia mundial de la electrónica y la cultura digital. La Fira Gran Via es accesible en metro L9 Sur (parada Fira), pero el festival termina entre las 6:00 y las 8:00, hora en que el metro ya ha reanudado el servicio. Los asistentes de Madrid, Valencia y Zaragoza prefieren el carpooling con ConcertRide para llegar directamente sin combinar AVE, metro y taxi.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Sónar by Night desde el centro de Barcelona?",
        a: "Sónar by Night se celebra en Fira Gran Via (L'Hospitalet de Llobregat), accesible en metro L9 Sur (parada Fira). El trayecto desde la plaza Catalunya dura unos 25 minutos con transbordo en la L3 o L5. El festival termina entre las 6:00 y las 8:00, momento en el que el metro ya funciona con servicio normal. Si has venido desde otra ciudad, puedes coordinar el regreso con ConcertRide para no esperar el primer tren de la mañana."
      },
      {
        q: "¿Cómo llegar a Sónar by Day (Fira Montjuïc) desde el centro de Barcelona?",
        a: "Sónar by Day se celebra en Fira Montjuïc, accesible en metro L3 (parada Espanya) o en el tranvía Trambaix desde la Gran Via. El trayecto desde las Ramblas es de unos 10–12 minutos. A diferencia de Sónar by Night, el horario diurno permite usar el transporte público sin restricciones. Muchos asistentes visitan ambas sedes el mismo día y se quedan a dormir en Barcelona si han viajado desde otra ciudad."
      },
      {
        q: "¿Cuánto cuesta ir a Sónar desde Madrid?",
        a: "Madrid–Barcelona son 620 km. Con ConcertRide, el viaje de ida suele costar entre 15 y 20 € por asiento. El AVE cuesta entre 40 y 100 € y no llega al recinto; hay que añadir metro L9 Sur desde la estación de Sants (unos 20 min adicionales). El carpooling te recoge en un punto acordado de Madrid y te deja cerca del festival."
      },
      {
        q: "¿Sónar tiene transporte o shuttle propio?",
        a: "Sónar suele habilitar shuttles pagados desde puntos del centro de Barcelona (Plaça Espanya, Gran Via) hacia Fira Gran Via en las horas previas al inicio de Sónar by Night. Sin embargo, para quienes vienen de fuera de Barcelona, el carpooling de ConcertRide es más cómodo y económico que combinar tren + shuttle."
      },
      {
        q: "¿Hay parking en Fira Gran Via durante Sónar?",
        a: "La Fira Gran Via dispone de parking propio (P1 y P2, unos 20–25 €/día), pero los accesos por la Gran Via de les Corts Catalanes y la Autopista A-2 se colapsan en las llegadas (a partir de las 22:00). La organización recomienda el transporte público (L9 Sur) para los residentes en Barcelona. Para conductores que vienen de fuera, lo más práctico es aparcar en zona azul de L'Hospitalet y tomar el metro hasta la parada Fira, o llegar directamente con ConcertRide."
      },
      {
        q: "¿Cuándo es Sónar 2026?",
        a: "Sónar 2026 está previsto para el 18, 19 y 20 de junio en Barcelona (Fira Montjuïc y Fira Gran Via de L'Hospitalet). Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["primavera-sound", "cruilla"]
  },
  {
    slug: "fib",
    name: "FIB — Festival Internacional de Benicàssim",
    shortName: "FIB",
    city: "Benicàssim",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Recinto Auditorio del Parque de Benicàssim",
    venueAddress: "Av. de Ferrandis Salvador, s/n, 12560 Benicàssim, Castellón",
    lat: 40.059,
    lng: 0.061,
    startDate: "2026-07-16",
    endDate: "2026-07-19",
    typicalDates: "Segunda semana de julio (edición 2026: 16–19 julio)",
    capacity: "45.000 personas/día",
    blurb: "El FIB (Festival Internacional de Benicàssim) es uno de los festivales de indie y alternativo más veteranos de España, celebrado desde 1995 en la Costa del Azahar a 15 km de Castellón de la Plana y 70 km de Valencia. El recinto está junto a la playa, con acceso en coche por la N-340 o la AP-7 (salida 47, Benicàssim Nord), pero el transporte público nocturno desde Castellón es prácticamente nulo después de las 2:00, y desde Valencia no existe conexión directa al recinto de madrugada. Más del 60% de los asistentes llegan en coche o carpooling desde otras provincias, lo que hace de ConcertRide la herramienta más útil para organizar la logística de los 4 días del festival.",
    originCities: [
      { city: "Valencia", km: 70, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 15, drivingTime: "20 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 465, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 300, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Zaragoza", km: 270, drivingTime: "2h 30 min", concertRideRange: "7–11 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar al FIB desde Valencia?",
        a: "Benicàssim está a 70 km de Valencia (unos 50 minutos en coche por la AP-7 o la N-340). Con ConcertRide, el precio por asiento desde Valencia suele ser de 3 a 6 €. También existe tren de Cercanías Valencia–Castellón (C6) con frecuencias cada 30–60 minutos en horario diurno, pero el enlace de Castellón al recinto de Benicàssim requiere taxi o bus adicional (10–15 min), y las frecuencias nocturnas son muy bajas."
      },
      {
        q: "¿Qué carretera usar para llegar al FIB en coche?",
        a: "Desde Barcelona y Zaragoza, la ruta más habitual es la AP-7 (autopista del Mediterráneo), salida 47 Benicàssim Nord. Desde Valencia y Madrid, también la AP-7 o la N-340 en tramos sin peaje. El tráfico en la N-340 puede congestionarse los jueves por la tarde. Si vienes con conductor de ConcertRide desde Madrid (12–17 €), Valencia (3–6 €) o Barcelona (8–12 €), él ya conoce la ruta y tú llegas directamente al recinto sin preocuparte por el aparcamiento."
      },
      {
        q: "¿Hay shuttles oficiales al FIB desde Castellón?",
        a: "El FIB organiza autobuses lanzadera desde la estación de autobuses de Castellón de la Plana hasta el recinto (unos 15 km, 15 minutos de trayecto) durante el festival. El servicio suele funcionar desde las 18:00 hasta la madrugada, con frecuencias de 20–30 minutos, pero las plazas se agotan rápido en los días de mayor afluencia. La alternativa más flexible es ConcertRide: puedes elegir el conductor, el punto de salida y el horario de regreso."
      },
      {
        q: "¿Hay parking en Benicàssim durante el FIB?",
        a: "El FIB habilita zonas de parking en los alrededores del recinto (5–10 € por día), pero se llenan con rapidez los jueves y viernes por la tarde. El parking más cercano al acceso principal está en la Avenida de Ferrandis Salvador. Muchos asistentes que llegan en coche se alojan en el camping del festival, por lo que aparcar no supone problema adicional para ellos."
      },
      {
        q: "¿Cómo ir al FIB desde Barcelona?",
        a: "Barcelona–Benicàssim son 300 km (2h 45 min por la AP-7). Con ConcertRide, el precio por asiento desde Barcelona está entre 8 y 12 €. El tren Barcelona–Castellón (Renfe MD o AVE) tarda entre 2h y 3h y cuesta 15–45 €, pero requiere transporte adicional hasta el recinto. El carpooling es la opción preferida de los barceloneses que quieren llegar directamente con su equipaje de camping."
      },
      {
        q: "¿Cuánto cuesta ir al FIB desde Madrid?",
        a: "El trayecto Madrid–Benicàssim son unos 465 km (4 horas). Por ConcertRide, el precio por asiento está típicamente entre 12 y 17 €. El autobús de larga distancia cuesta entre 18 y 30 € sin garantizar conexión hasta el recinto."
      },
      {
        q: "¿El FIB tiene camping?",
        a: "Sí, el FIB tiene zona de camping incluida con la entrada general. Muchos asistentes llegan en coche compartido y se instalan en el camping los 4 días del festival. ConcertRide permite organizar tanto la ida como la vuelta al final del festival."
      },
      {
        q: "¿Cuándo es el FIB 2026?",
        a: "El Festival Internacional de Benicàssim 2026 está previsto para el 16, 17, 18 y 19 de julio. Busca viajes disponibles en concertride.me con destino Benicàssim."
      }
    ],
    relatedFestivals: ["arenal-sound", "medusa-festival", "low-festival"]
  },
  {
    slug: "bbk-live",
    name: "Bilbao BBK Live",
    shortName: "BBK Live",
    city: "Bilbao",
    citySlug: "bilbao",
    region: "País Vasco",
    venue: "Parque de Kobetamendi",
    venueAddress: "Barrio Landabaso, 48015 Bilbao",
    lat: 43.272,
    lng: -2.949,
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    typicalDates: "Segunda semana de julio (edición 2026: 9–11 julio)",
    capacity: "30.000 personas/día",
    blurb: "Bilbao BBK Live es el festival internacional de referencia del norte de España, celebrado cada julio en el monte Kobetamendi con vistas a la ría de Bilbao. El recinto está a unos 4 km del centro de Bilbao y el acceso en transporte público nocturno es limitado. El carpooling es especialmente útil para asistentes que vienen desde Donostia, Vitoria, Pamplona o Madrid.",
    originCities: [
      { city: "Centro de Bilbao", km: 5, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Donostia / San Sebastián", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Pamplona", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo subir a Kobetamendi durante el BBK Live?",
        a: "El festival organiza autobuses lanzadera desde el centro de Bilbao (plaza Moyúa y estación de Abando) durante toda la jornada. La frecuencia es de unos 15 minutos y el precio está incluido en la entrada. También se puede subir en taxi desde Bilbao centro (unos 12–18 €). Con ConcertRide puedes organizar el viaje desde otras provincias y luego tomar el shuttle oficial hasta el recinto desde Bilbao."
      },
      {
        q: "¿Se puede aparcar en Kobetamendi para el BBK Live?",
        a: "El acceso en coche propio a Kobetamendi es muy limitado. El parque del monte tiene pocas plazas de aparcamiento y la carretera de acceso es estrecha. BBK Live desaconseja venir en coche al recinto. Lo más práctico para conductores de fuera del País Vasco es aparcar en el centro de Bilbao (parking subterráneo desde 12 €/día) y tomar el shuttle oficial hasta el monte."
      },
      {
        q: "¿Cómo ir al BBK Live desde Donostia?",
        a: "La distancia Donostia–Bilbao es de 100 km (1 hora por la AP-8). Por ConcertRide, el precio por asiento es de 4 a 7 €. El Euskotren conecta ambas ciudades pero las frecuencias en horarios de festival de madrugada son muy limitadas (último tren antes de la 1:00)."
      },
      {
        q: "¿Cuánto cuesta ir al BBK Live desde Madrid?",
        a: "El trayecto Madrid–Bilbao son 395 km (3h 30 min por la A-1 o la AP-1). Por ConcertRide, los precios están entre 11 y 16 € por asiento. El vuelo suele costar entre 60 y 120 € con equipaje, sin incluir el desplazamiento al recinto. El autobús de larga distancia Madrid–Bilbao cuesta 20–35 € pero llega a la estación de Termibús, a 5 km del festival."
      },
      {
        q: "¿Cómo ir al BBK Live desde Santander?",
        a: "Santander está a 100 km de Bilbao (1 hora por la A-8). Con ConcertRide, el precio por asiento desde Santander está entre 4 y 7 €. El tren Renfe Santander–Bilbao (vía Renfe Media Distancia) tarda entre 2h y 2h 30 min y cuesta entre 8 y 15 €, pero el último servicio de vuelta sale antes de las 22:00 — imposible para volver del festival. El carpooling con ConcertRide es la única opción práctica para ir y volver desde Santander en horarios de festival."
      },
      {
        q: "¿Cómo ir al BBK Live desde Burgos?",
        a: "Burgos está a 155 km de Bilbao (1h 30 min por la A-1). Con ConcertRide, el precio por asiento desde Burgos está entre 5 y 8 €. No hay tren directo Burgos–Bilbao con frecuencias adecuadas para el festival."
      },
      {
        q: "¿Cuándo es el BBK Live 2026?",
        a: "Bilbao BBK Live 2026 está previsto para el 9, 10 y 11 de julio. Busca viajes en concertride.me con destino Bilbao."
      }
    ],
    relatedFestivals: ["resurrection-fest", "sonorama-ribera"]
  },
  {
    slug: "resurrection-fest",
    name: "Resurrection Fest",
    shortName: "Resurrection Fest",
    city: "Viveiro",
    citySlug: "santiago-de-compostela",
    region: "Galicia",
    venue: "A Gañidoira",
    venueAddress: "Parque A Gañidoira, 27850 Viveiro, Lugo",
    lat: 43.666,
    lng: -7.599,
    startDate: "2026-06-25",
    endDate: "2026-06-28",
    typicalDates: "Última semana de junio / primera de julio (edición 2026: 25–28 junio)",
    capacity: "30.000 personas/día",
    blurb: "Resurrection Fest es el festival de metal y rock pesado más importante de España, celebrado en Viveiro (Lugo) desde 2006. El recinto de A Gañidoira está situado a las afueras del municipio, con transporte público prácticamente nulo en horarios nocturnos. La mayoría de los asistentes llegan en coche, y el carpooling entre fans de metal es una tradición desde los primeros años del festival.",
    originCities: [
      { city: "A Coruña", km: 100, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Santiago de Compostela", km: 185, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Vigo", km: 200, drivingTime: "2h 15 min", concertRideRange: "6–9 €/asiento" },
      { city: "Oviedo", km: 195, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "6h", concertRideRange: "16–22 €/asiento" },
      { city: "Bilbao", km: 375, drivingTime: "4h", concertRideRange: "10–15 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Resurrection Fest desde A Coruña?",
        a: "A Coruña está a 100 km de Viveiro (1h 15 min en coche por la N-651 o la A-8/AG-64). Es la ciudad de origen más habitual para los asistentes gallegos. Con ConcertRide, el precio por asiento ronda los 4–7 €. No existe transporte público nocturno que conecte ambas ciudades en horarios de festival — el autobús de ALSA opera de día pero no en madrugada."
      },
      {
        q: "¿Hay camping en Resurrection Fest?",
        a: "Sí, Resurrection Fest tiene una amplia zona de camping adyacente al recinto de A Gañidoira, con abono de 4 noches incluido en algunos pases. Muchos fans llegan el miércoles o jueves con sus tiendas de campaña y se instalan hasta el domingo. ConcertRide permite organizar la ida (miércoles/jueves) y la vuelta al final del festival de forma flexible."
      },
      {
        q: "¿Cómo ir a Resurrection Fest desde Madrid?",
        a: "El trayecto Madrid–Viveiro son 600 km (6 horas por la A-6). Por ConcertRide, el precio por asiento está entre 16 y 22 €, frente a los 30–60 € en autobús de larga distancia con transbordo en A Coruña o Lugo. La opción de venir 4–5 personas en coche y dividir la gasolina (unos 80–100 € total en 2025 con gasolina a 1,62 €/l) es la más habitual entre fans madrileños."
      },
      {
        q: "¿Hay transporte público a Viveiro durante el festival?",
        a: "Viveiro es una pequeña ciudad de la Costa Lucense sin líneas de AVE ni aeropuerto propio. El aeropuerto más cercano es Asturias (3h) o Santiago de Compostela (2h 30 min). El autobús ALSA opera rutas desde A Coruña, Lugo y Oviedo, pero las frecuencias son 2–3 al día y no cubren horarios de madrugada. Por esto Resurrection Fest es el festival español con mayor dependencia del coche propio o del carpooling."
      },
      {
        q: "¿Cómo ir a Resurrection Fest desde Bilbao?",
        a: "Bilbao–Viveiro son 375 km (4 horas por la A-8 y la N-634). Con ConcertRide, el precio por asiento está entre 10 y 15 €. No existe tren directo ni autobús de larga distancia cómodo para este trayecto."
      },
      {
        q: "¿Cuándo es Resurrection Fest 2026?",
        a: "La edición 2026 de Resurrection Fest está prevista para el 25, 26, 27 y 28 de junio en A Gañidoira, Viveiro (Lugo). Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["o-son-do-camino", "sonorama-ribera"]
  },
  {
    slug: "arenal-sound",
    name: "Arenal Sound",
    shortName: "Arenal Sound",
    city: "Burriana",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Playa de Burriana",
    venueAddress: "Playa de Burriana, 12530 Burriana, Castellón",
    lat: 39.881,
    lng: -0.078,
    startDate: "2026-07-29",
    endDate: "2026-08-02",
    typicalDates: "Primera semana de agosto (edición 2026: 29 julio–2 agosto)",
    capacity: "40.000 personas/día",
    blurb: "Arenal Sound es el festival de playa más popular del Mediterráneo español, celebrado en la costa de Burriana (Castellón) desde 2010 durante 5 días en agosto. Combina música pop, indie y electrónica con ambiente playero a pie de mar, con capacidad para 40.000 asistentes diarios. El recinto se encuentra a 10 km de Castellón de la Plana (por la N-340) y a 65 km de Valencia (por la AP-7 o la N-340), pero el transporte público nocturno es prácticamente inexistente desde la playa a las 6:00 de la mañana: no hay tren directo al recinto ni autobús nocturno desde Castellón. La gran mayoría de asistentes organizan su logística en coche compartido a través de ConcertRide, que permite llegar directamente al festival con el equipo de camping y coordinar la vuelta al final de la semana.",
    originCities: [
      { city: "Valencia", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 460, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 305, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Zaragoza", km: 275, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Alicante", km: 115, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo ir a Arenal Sound desde Valencia?",
        a: "Valencia está a solo 65 km de Burriana (45 minutos por la AP-7 o la N-340). Con ConcertRide, los viajes desde Valencia cuestan entre 3 y 6 € por asiento. También hay trenes de Cercanías Valencia–Castellón (C6, 45–60 min, frecuencia horaria en días laborables), aunque el acceso a la playa del festival desde la estación de Castellón requiere bus o taxi adicional (10–15 min)."
      },
      {
        q: "¿Qué carretera usar para llegar a Arenal Sound?",
        a: "Desde Valencia y Barcelona, la AP-7 (salida Burriana o Villarreal) es la ruta más rápida. Desde Madrid, la A-3 hasta Valencia y luego la AP-7 (aprox. 4h). La N-340 es la alternativa sin peaje desde Castellón, aunque puede congestionarse los jueves y domingos. Si tienes plaza en un viaje de ConcertRide desde Madrid (12–17 €), Valencia (3–6 €) o Barcelona (8–12 €), no te preocupa ni la carretera ni el parking: el conductor lleva el coche directamente al recinto."
      },
      {
        q: "¿Hay shuttle oficial desde Castellón a Arenal Sound?",
        a: "El festival suele habilitar autobuses lanzadera desde la estación de autobuses de Castellón de la Plana hasta el recinto de Burriana durante los días del festival (aprox. 15 km, 20 minutos). El servicio funciona en las franjas horarias de entrada y salida pero no en la madrugada. Para quienes llegan de lejos con equipo de camping, el carpooling de ConcertRide es más cómodo al no tener restricciones de equipaje."
      },
      {
        q: "¿Hay parking en Arenal Sound?",
        a: "El festival habilita zonas de parking en las inmediaciones de la playa de Burriana, a entre 5 y 10 minutos a pie del recinto (5–8 €/día). Las plazas son suficientes para la mayoría de los asistentes, aunque se recomienda llegar antes de las 19:00 los días de mayor afluencia para encontrar sitio cerca. Los asistentes con pase de camping pueden aparcar en la zona de autocaravanas contigua al camping."
      },
      {
        q: "¿Cómo ir a Arenal Sound desde Barcelona?",
        a: "Barcelona–Burriana son 305 km (2h 50 min por la AP-7). Con ConcertRide, el precio por asiento está entre 8 y 12 €. El tren Barcelona–Castellón (Renfe MD) tarda unas 3h y cuesta entre 15 y 35 €, pero requiere transporte adicional hasta el recinto de playa. Muchos barceloneses organizan grupos de 4–5 personas y reparten el coste de la gasolina, resultando en menos de 10 € por persona."
      },
      {
        q: "¿Cuánto cuesta ir a Arenal Sound desde Madrid?",
        a: "El trayecto Madrid–Burriana son 460 km (4 horas). Por ConcertRide, el precio por asiento está entre 12 y 17 €. El autobús de línea Madrid–Castellón cuesta entre 15 y 25 € pero no llega al recinto de playa."
      },
      {
        q: "¿Hay camping en Arenal Sound?",
        a: "Sí, Arenal Sound tiene zona de camping junto a la playa, incluida con el pase del festival. Muchos asistentes llegan el miércoles y se quedan toda la semana. El carpooling con ConcertRide es la opción más habitual para los que vienen de Madrid, Zaragoza o Barcelona, ya que permite traer todo el equipo directamente."
      },
      {
        q: "¿Hay tren a Arenal Sound? ¿Cómo llegar en tren?",
        a: "No existe tren directo al recinto de Arenal Sound en la playa de Burriana. La opción más cercana en tren es la línea de Cercanías Renfe C6 Valencia–Castellón (45–60 min, frecuencia cada 30–60 min), con parada en Castellón de la Plana. Desde allí quedan 10 km hasta el recinto, que deben cubrirse en taxi (10–15 €) o en el autobús lanzadera del festival cuando esté operativo. En la práctica, esta combinación tren + taxi/lanzadera solo funciona bien en horario diurno: no hay trenes de Cercanías desde Castellón después de las 23:00, por lo que la vuelta a madrugada es imposible en transporte público. Para los que vienen de Valencia, ConcertRide (3–6 €/asiento, puerta a puerta) es más rápido y cómodo que la combinación tren+taxi."
      },
      {
        q: "¿Hay autobús de Castellón a Burriana para Arenal Sound?",
        a: "Durante el festival, Arenal Sound habilita autobuses lanzadera desde la estación de autobuses de Castellón de la Plana hasta el recinto de la playa de Burriana (10 km, unos 20 min). El servicio suele operar en las franjas de llegada (tarde/noche) y de regreso (madrugada/mañana), pero las plazas son limitadas y se agotan rápido en los días de mayor afluencia. Fuera del horario de lanzadera, un taxi Castellón–Burriana cuesta entre 10 y 15 €. Para los que vienen de otras ciudades — Madrid (12–17 €), Barcelona (8–12 €), Alicante (4–7 €) — ConcertRide permite llegar directamente al recinto sin pasar por Castellón, con todo el equipo de camping y sin horarios fijos."
      },
      {
        q: "¿Cómo llegar a Arenal Sound desde Alicante?",
        a: "Alicante–Burriana son 115 km (1h 15 min por la A-7). Con ConcertRide, el precio por asiento desde Alicante está entre 4 y 7 €. No existe transporte público directo Alicante–Burriana en horarios de festival. El tren Alicante–Castellón (Euromed, 1h 15 min) más lanzadera o taxi al recinto es una opción para la ida, pero no cubre la vuelta de madrugada."
      },
      {
        q: "¿Cuándo es Arenal Sound 2026?",
        a: "Arenal Sound 2026 está previsto del 29 de julio al 2 de agosto en la playa de Burriana (Castellón). Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["fib", "medusa-festival", "low-festival"]
  },
  {
    slug: "medusa-festival",
    name: "Medusa Festival",
    shortName: "Medusa",
    city: "Cullera",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Playa de Cullera",
    venueAddress: "Playa Marenys de Rafalcaid, 46400 Cullera, Valencia",
    lat: 39.156,
    lng: -0.246,
    startDate: "2026-08-12",
    endDate: "2026-08-16",
    typicalDates: "Segunda semana de agosto (edición 2026: 12–16 agosto)",
    capacity: "60.000 personas/día",
    blurb: "Medusa Festival es el mayor festival de música electrónica de España, celebrado en la playa de Cullera (Valencia) desde 2012, con 60.000 fans de techno, house y electrónica durante 5 días con el mar Mediterráneo al fondo. El recinto se encuentra a 45 km al sur de Valencia (por la V-31 y la CV-500), con acceso en autobús metropolitano desde Valencia hasta Cullera y lanzadera final hasta la playa, pero el servicio se interrumpe en la madrugada y no hay transporte nocturno desde Alicante, Madrid o Zaragoza. La zona de camping del festival aloja a la mayoría de los asistentes de fuera de la Comunidad Valenciana, que llegan habitualmente en coche compartido por ConcertRide para evitar la complejidad de combinar trenes y autobuses con equipo de camping.",
    originCities: [
      { city: "Valencia", km: 45, drivingTime: "40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 385, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 375, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Zaragoza", km: 320, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Murcia", km: 180, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Medusa Festival desde Valencia?",
        a: "Cullera está a 45 km de Valencia (40 minutos por la V-31 y la CV-500). Desde la ciudad hay autobús metropolitano de la EMT o Autocares Herca hasta Cullera y luego lanzadera del festival hasta el recinto de playa. Con ConcertRide, el precio por asiento desde Valencia es de 3 a 5 €, y te lleva directamente hasta la entrada del festival sin transbordos."
      },
      {
        q: "¿Hay shuttle desde Valencia a Medusa Festival?",
        a: "Medusa habilita autobuses lanzadera desde varios puntos de Valencia (estación del Norte, Xàtiva) hasta el recinto de Cullera durante los días del festival. El servicio opera en las franjas de llegada (a partir de las 20:00) y de regreso (hasta las 8:00), pero las plazas son limitadas y se agotan rápido. Para asistentes de fuera de Valencia, ConcertRide permite llegar directamente al recinto sin depender de los horarios de lanzadera."
      },
      {
        q: "¿Hay parking en Medusa Festival?",
        a: "El festival habilita zonas de parking en las inmediaciones del recinto de Cullera, a entre 5 y 15 minutos a pie de los accesos (8–12 €/día). El acceso por la CV-500 desde Valencia puede congestionarse los miércoles y jueves de llegada masiva. Los asistentes con pase de camping que llegan en coche tienen una zona de parking específica contigua al área de acampada."
      },
      {
        q: "¿Cómo ir a Medusa desde Barcelona?",
        a: "Barcelona–Cullera son 375 km (3h 30 min por la AP-7 y la V-31). Con ConcertRide, el precio por asiento desde Barcelona está entre 10 y 14 €. El tren Barcelona–Valencia (AVE, 3h, 25–60 €) más bus o taxi hasta Cullera es una alternativa válida para los que no llevan equipo de camping, pero suma más de 1h de viaje adicional."
      },
      {
        q: "¿Hay camping en Medusa Festival?",
        a: "Sí, Medusa tiene zona de camping a pocos metros del recinto. Muchos asistentes de Madrid, Barcelona o Zaragoza llegan en coche compartido y acampan los 5 días. El camping incluye duchas y aseos; se recomienda reservar la pulsera de camping con la entrada. ConcertRide facilita encontrar viaje de ida y vuelta y llegar directamente con toda la equipación."
      },
      {
        q: "¿Cuánto cuesta ir a Medusa desde Madrid?",
        a: "Madrid–Cullera son unos 385 km (3h 30 min por la A-3). Por ConcertRide, el precio por asiento está entre 10 y 14 €. Un taxi desde Valencia al recinto cuesta entre 40 y 60 €."
      },
      {
        q: "¿Cuándo es Medusa Festival 2026?",
        a: "Medusa Festival 2026 está previsto para el 12 al 16 de agosto en la playa de Cullera (Valencia). Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["arenal-sound", "fib", "low-festival"]
  },
  {
    slug: "vina-rock",
    name: "Viña Rock",
    shortName: "Viña Rock",
    city: "Villarrobledo",
    citySlug: "valencia",
    region: "Castilla-La Mancha",
    venue: "La Pulgosa",
    venueAddress: "Parque La Pulgosa, 02600 Villarrobledo, Albacete",
    lat: 39.264,
    lng: -2.602,
    startDate: "2026-04-30",
    endDate: "2026-05-03",
    typicalDates: "Puente de mayo (edición 2026: 30 abril–3 mayo)",
    capacity: "50.000 personas/día",
    blurb: "Viña Rock es el festival de rock alternativo, punk y metal más longevo de España, celebrado en Villarrobledo (Albacete) desde 1996 en el puente de mayo. El recinto de La Pulgosa está situado en plena meseta manchega, a 190 km de Madrid (A-3), 200 km de Valencia (A-3) y 165 km de Alicante (A-31), sin ninguna línea de transporte público que llegue al recinto en horarios de festival. Con 50.000 asistentes diarios y una zona de camping de referencia, Viña Rock es uno de los festivales con mayor dependencia del coche particular y el carpooling: más del 80% de los asistentes llegan en coche, y ConcertRide es la herramienta habitual para organizar el viaje compartido desde Madrid, Valencia o Alicante.",
    originCities: [
      { city: "Madrid", km: 190, drivingTime: "1h 55 min", concertRideRange: "6–9 €/asiento" },
      { city: "Valencia", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Albacete", km: 50, drivingTime: "40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Alicante", km: 165, drivingTime: "1h 35 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Cuenca", km: 100, drivingTime: "1h", concertRideRange: "4–6 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Viña Rock desde Madrid?",
        a: "Villarrobledo está a 190 km de Madrid (menos de 2 horas por la A-3 dirección Valencia, salida Villarrobledo). No hay transporte público directo al recinto de La Pulgosa. Con ConcertRide, el precio por asiento desde Madrid suele ser de 6 a 9 €. Muchos grupos de amigos de Madrid se organizan en coche compartido para ir los 4 días del festival."
      },
      {
        q: "¿Hay shuttle desde Albacete a Viña Rock?",
        a: "El festival organiza autobuses lanzadera desde la estación de autobuses de Albacete (50 km, 40 min) con frecuencias de 1–2 horas los jueves y viernes de llegada, hasta aproximadamente la 1:00. Desde Madrid la A-3 (salida 163 Villarrobledo) es la ruta principal; desde Alicante, la A-31 hasta Albacete y luego la N-322. Para los que vienen de Madrid (6–9 €), Valencia (6–9 €) o Alicante (5–8 €) con ConcertRide, el conductor llega directamente al camping de La Pulgosa sin necesidad de shuttle."
      },
      {
        q: "¿Hay parking en La Pulgosa (Viña Rock)?",
        a: "El recinto de La Pulgosa dispone de amplias zonas de parking gratuito (o con precio simbólico, 2–5 €/día) en los campos adyacentes al festival. Es uno de los pocos festivales grandes de España donde el parking no es un problema grave: hay espacio suficiente para varios miles de vehículos. Aun así, los días de mayor afluencia (jueves y viernes) los accesos por la N-322 pueden congestionarse por la tarde."
      },
      {
        q: "¿Cómo ir a Viña Rock desde Alicante?",
        a: "Alicante–Villarrobledo son 165 km (1h 35 min por la A-31 hasta Albacete y luego la N-322). Con ConcertRide, el precio por asiento desde Alicante está entre 5 y 8 €. No existe autobús de línea regular que llegue al recinto en horarios de festival desde Alicante."
      },
      {
        q: "¿Hay camping en Viña Rock?",
        a: "Sí, Viña Rock tiene una amplia zona de camping incluida con la entrada. La mayoría de asistentes llegan el jueves por la noche y se quedan hasta el domingo. ConcertRide permite organizar la ida el miércoles-jueves y la vuelta el domingo."
      },
      {
        q: "¿Cuánto cuesta ir a Viña Rock desde Valencia?",
        a: "Valencia–Villarrobledo son 200 km (2 horas por la A-3). Por ConcertRide, el precio por asiento está entre 6 y 9 €. Un autobús de línea Valencia–Albacete + taxi al festival costaría entre 25 y 40 €."
      },
      {
        q: "¿Hay autobús o bus oficial a Viña Rock desde Madrid?",
        a: "No existe autobús directo oficial desde Madrid al recinto de La Pulgosa. Algunos operadores privados ofrecen autobuses Madrid–Viña Rock (35–55 €, salida fija desde Nuevos Ministerios o Méndez Álvaro), pero las plazas son muy limitadas, el horario de salida es inamovible y la vuelta suele ser a las 6:00 del domingo sin posibilidad de ajustarla. ConcertRide es la alternativa más flexible: el precio por asiento desde Madrid es de 6 a 9 € y tú eliges el conductor, el punto de salida y la hora de regreso. Muchos asistentes se organizan grupos de 3–4 personas para ir y volver cómodamente."
      },
      {
        q: "¿Hay bus desde Albacete a Viña Rock?",
        a: "Sí, el festival habilita autobuses lanzadera desde la estación de autobuses de Albacete (50 km, unos 40 min) durante los días de llegada y salida del festival. Las frecuencias suelen ser cada 1–2 horas entre las 18:00 y la 1:00. Es la única opción de transporte público colectivo que conecta con el recinto. Para quienes vienen de otras ciudades (Madrid, Valencia, Alicante), ConcertRide resulta más económico y directo al recinto que llegar en AVE a Albacete y luego tomar el bus del festival."
      },
      {
        q: "¿Cuándo es Viña Rock 2026?",
        a: "Viña Rock 2026 se celebra del 30 de abril al 3 de mayo en La Pulgosa, Villarrobledo (Albacete). Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["mad-cool", "sonorama-ribera"]
  },
  {
    slug: "o-son-do-camino",
    name: "O Son do Camiño",
    shortName: "Son do Camiño",
    city: "Santiago de Compostela",
    citySlug: "santiago-de-compostela",
    region: "Galicia",
    venue: "Monte do Gozo",
    venueAddress: "Monte do Gozo, 15820 Santiago de Compostela, A Coruña",
    lat: 42.894,
    lng: -8.517,
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    typicalDates: "Segunda quincena de junio (edición 2026: 18–20 junio)",
    capacity: "90.000 personas (3 días)",
    blurb: "O Son do Camiño es el festival más importante de Galicia, celebrado en el Monte do Gozo de Santiago de Compostela desde 2019, con 90.000 asistentes en tres jornadas que combinan pop, indie y rock nacional e internacional junto al camino jacobeo. El recinto del Monte do Gozo se encuentra a 5 km del casco histórico de Santiago, accesible por la autovía AG-54 (salida Monte do Gozo) o en autobús lanzadera desde el centro de la ciudad, pero sin conexión de transporte público directo desde Vigo (90 km), Oviedo (295 km) o Madrid (585 km) en horarios de madrugada. Organizar el viaje con ConcertRide es especialmente útil para los asistentes de toda Galicia y del norte de España que quieren llegar directamente al recinto y coordinar la vuelta a cualquier hora.",
    originCities: [
      { city: "Santiago de Compostela (centro)", km: 5, drivingTime: "10 min", concertRideRange: "3–5 €/asiento" },
      { city: "A Coruña", km: 70, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Vigo", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Pontevedra", km: 60, drivingTime: "45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Oviedo", km: 295, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Madrid", km: 585, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Son do Camiño desde A Coruña?",
        a: "A Coruña está a 70 km de Santiago (50 minutos por la AP-9). Con ConcertRide, el precio por asiento desde A Coruña es de 3 a 6 €. El tren Renfe A Coruña–Santiago tarda 35 minutos, pero el festival termina tarde y los trenes nocturnos son escasos (último convencional antes de la 1:00). El carpooling permite coordinar la vuelta a cualquier hora."
      },
      {
        q: "¿Hay lanzadera desde el centro de Santiago al Monte do Gozo?",
        a: "Sí, el festival organiza autobuses lanzadera desde el centro de Santiago de Compostela (parada Galeras / Rúa do Franco) hasta el Monte do Gozo con frecuencias de unos 15–20 minutos durante el festival. El trayecto dura aproximadamente 15 minutos. Para quienes vienen de fuera de Galicia, ConcertRide permite llegar directamente al área del festival desde su ciudad de origen sin depender de los horarios de lanzadera."
      },
      {
        q: "¿Hay parking en el Monte do Gozo?",
        a: "El Monte do Gozo dispone de zonas de parking en los alrededores del recinto (gratuito o con precio reducido, hasta 5 €/día). El acceso principal es por la AG-54 (salida Monte do Gozo). En los días de mayor afluencia, el parking se llena a partir de las 18:00 y se habilitan zonas adicionales en los campos adyacentes. La lanzadera desde el centro de Santiago es la alternativa recomendada para quienes se alojan en la ciudad."
      },
      {
        q: "¿Cómo ir al Son do Camiño desde Vigo?",
        a: "Vigo está a 90 km de Santiago (1 hora por la AP-9). El precio por asiento con ConcertRide desde Vigo está entre 4 y 7 €. El tren Vigo–Santiago tarda 1h 15 min pero las frecuencias nocturnas son muy limitadas (último tren convencional antes de las 22:00)."
      },
      {
        q: "¿Cómo ir al Son do Camiño desde Madrid?",
        a: "Madrid–Santiago de Compostela son 585 km (5h 30 min por la A-6). Con ConcertRide, el precio por asiento está entre 15 y 20 €. El AVE Madrid–Santiago dura unas 5h y cuesta entre 40 y 90 €, pero el último tren de regreso suele salir a las 20:00, lo que no encaja con los horarios del festival. El carpooling permite salir y volver a la hora que mejor convenga."
      },
      {
        q: "¿Cuándo es O Son do Camiño 2026?",
        a: "O Son do Camiño 2026 está previsto para el 18, 19 y 20 de junio en el Monte do Gozo, Santiago de Compostela. Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["resurrection-fest"]
  },
  {
    slug: "cala-mijas",
    name: "Cala Mijas Fest",
    shortName: "Cala Mijas",
    city: "Mijas",
    citySlug: "malaga",
    region: "Andalucía",
    venue: "Recinto Cortijo de Torres",
    venueAddress: "Av. Juan Carlos I, s/n, 29016 Málaga",
    lat: 36.692,
    lng: -4.513,
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    typicalDates: "Primera semana de octubre (edición 2026: 2–4 octubre)",
    capacity: "30.000 personas/día",
    blurb: "Cala Mijas Fest es el festival de indie y alternativo de la Costa del Sol, celebrado en el Cortijo de Torres de Málaga desde 2021 con artistas nacionales e internacionales de primer nivel. El recinto se sitúa a 25 km del centro de Málaga (por la MA-20/A-7) y a unos 30 km de Marbella, con acceso complicado en transporte público nocturno: no existe ninguna línea de bus nocturna que llegue al Cortijo de Torres, y el taxi desde el centro de Málaga cuesta entre 25 y 40 €. Para los asistentes de Sevilla (200 km), Granada (125 km) o Córdoba (190 km) el carpooling con ConcertRide es la solución más cómoda y económica para llegar directamente al recinto y volver sin depender de taxis.",
    originCities: [
      { city: "Málaga", km: 25, drivingTime: "25 min", concertRideRange: "3–5 €/asiento" },
      { city: "Marbella", km: 50, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Sevilla", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Granada", km: 125, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Almería", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Córdoba", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo ir a Cala Mijas desde Málaga?",
        a: "El recinto del Cortijo de Torres está a 25 km del centro de Málaga (25 minutos por la MA-20 y la A-7 dirección Marbella). Con ConcertRide, el precio por asiento desde Málaga es de 3 a 5 €. No existe transporte público nocturno hasta el recinto; el taxi cuesta entre 25 y 40 €."
      },
      {
        q: "¿Hay shuttle desde Málaga ciudad a Cala Mijas?",
        a: "Cala Mijas no dispone de shuttle oficial desde el centro de Málaga ni desde el aeropuerto. Algunos organizadores privados han habilitado autobuses puntuales desde el Paseo del Parque, pero no son un servicio consolidado. La alternativa más fiable es ConcertRide: puedes encontrar plazas desde Málaga centro, el aeropuerto o la Costa del Sol por 3–6 €."
      },
      {
        q: "¿Hay parking en el Cortijo de Torres (Cala Mijas)?",
        a: "El Cortijo de Torres dispone de un parking propio con capacidad para varios cientos de vehículos (precio habitual 10–15 €/día o incluido en el entrada VIP). Los accesos por la A-7 (autopista del Sol) pueden congestionarse en las llegadas del viernes por la tarde. Para los que vienen de fuera de Málaga, llegar en carpooling con ConcertRide evita el coste y el estrés del parking."
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Granada?",
        a: "Granada–Cortijo de Torres son 125 km (1h 30 min por la A-92 y la A-45). Con ConcertRide, el precio por asiento desde Granada es de 5 a 8 €. El autobús Granada–Málaga cuesta 10–15 € pero el último regresa pronto y no llega al recinto directamente."
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Córdoba?",
        a: "Córdoba–Cortijo de Torres son 190 km (2 horas por la A-45). Con ConcertRide, el precio por asiento desde Córdoba es de 6 a 9 €. El tren Córdoba–Málaga (AVE, 1h) es una buena opción para llegar a Málaga ciudad, pero desde allí hay que añadir taxi o carpooling hasta el recinto."
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Sevilla?",
        a: "Sevilla está a 200 km de Málaga (2 horas). Con ConcertRide, el precio por asiento desde Sevilla es de 6 a 9 €. El tren Sevilla–Málaga tarda 2h pero el último regresa pronto y no llega al recinto directamente."
      },
      {
        q: "¿Cuándo es Cala Mijas Fest 2026?",
        a: "Cala Mijas Fest 2026 está previsto para el 2, 3 y 4 de octubre en el Cortijo de Torres, Málaga. Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["sonar", "primavera-sound"]
  },
  {
    slug: "sonorama-ribera",
    name: "Sonorama Ribera",
    shortName: "Sonorama",
    city: "Aranda de Duero",
    citySlug: "madrid",
    region: "Castilla y León",
    venue: "Estadio Municipal El Montecillo",
    venueAddress: "C. del Estadio, 09400 Aranda de Duero, Burgos",
    lat: 41.668,
    lng: -3.689,
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    typicalDates: "Primera semana de agosto (edición 2026: 6–9 agosto)",
    capacity: "25.000 personas/día",
    blurb: "Sonorama Ribera es el festival de pop y rock español más querido del panorama independiente, celebrado en Aranda de Duero (Burgos) desde 1998. Con música de artistas en castellano y actuaciones únicas, convoca a fans de todo el país durante 4 días en agosto. Aranda de Duero está a 150 km de Madrid (por la A-1), 100 km de Valladolid y 70 km de Burgos, en plena Ribera del Duero, con una única línea de autobús Madrid–Aranda que no opera en horarios de madrugada y sin servicio de tren al municipio. El carpooling con ConcertRide es esencial para la mayoría de los asistentes que llegan de Madrid, Bilbao, Zaragoza o Valladolid, y se ha convertido en parte de la cultura del festival.",
    originCities: [
      { city: "Madrid", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valladolid", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 70, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Bilbao", km: 185, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Zaragoza", km: 290, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Segovia", km: 125, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo ir a Sonorama desde Madrid?",
        a: "Aranda de Duero está a 150 km de Madrid (1h 30 min por la A-1, salida 153 Aranda de Duero Sur). Con ConcertRide, el precio por asiento desde Madrid es de 5 a 8 €. El autobús de línea Madrid–Aranda (empresa La Sepulvedana) cuesta entre 10 y 15 € y opera varias veces al día, pero no funciona en horarios de madrugada y la parada no está junto al recinto."
      },
      {
        q: "¿Hay shuttle de Madrid a Sonorama?",
        a: "Sonorama no dispone de shuttle oficial desde Madrid. En años anteriores algunos organizadores privados han ofrecido autobuses puntuales desde Moncloa, pero no es un servicio consolidado. ConcertRide es la alternativa más fiable y flexible: puedes salir desde cualquier barrio de Madrid y coordinar la vuelta al final del festival."
      },
      {
        q: "¿Hay parking en Aranda de Duero durante Sonorama?",
        a: "Aranda de Duero dispone de amplio aparcamiento en las calles del entorno del estadio El Montecillo y en zonas habilitadas para el festival (gratuito en su mayoría). Al ser una ciudad pequeña (35.000 habitantes), el festival ha adaptado la logística para facilitar el acceso en coche. Se recomienda aparcar en los polígonos industriales de los accesos y caminar 5–10 minutos hasta el recinto."
      },
      {
        q: "¿Cómo ir a Sonorama desde Valladolid?",
        a: "Valladolid–Aranda de Duero son 100 km (1 hora por la A-11 y la A-1). Con ConcertRide, el precio por asiento desde Valladolid es de 4 a 7 €. El autobús Valladolid–Aranda opera varias veces al día, pero las frecuencias los fines de semana de agosto son reducidas y no hay servicio nocturno."
      },
      {
        q: "¿Cómo ir a Sonorama desde Zaragoza?",
        a: "Zaragoza–Aranda de Duero son 290 km (2h 30 min por la A-2 y la A-1). Con ConcertRide, el precio por asiento desde Zaragoza está entre 8 y 12 €. No existe autobús directo Zaragoza–Aranda, por lo que el coche compartido es la única opción práctica para los asistentes aragoneses."
      },
      {
        q: "¿Cuándo es Sonorama Ribera 2026?",
        a: "Sonorama Ribera 2026 está previsto del 6 al 9 de agosto en Aranda de Duero (Burgos). Busca viajes en concertride.me."
      },
      {
        q: "¿Hay camping en Sonorama?",
        a: "Sí, Sonorama tiene zona de camping próxima al estadio. Muchos fans de Madrid o Bilbao llegan el jueves y se quedan hasta el domingo. ConcertRide permite organizar la ida y la vuelta con asiento garantizado."
      },
      {
        q: "¿Cómo llegar a Sonorama desde Bilbao?",
        a: "Bilbao–Aranda de Duero son 185 km (2 horas por la AP-68/A-1). Por ConcertRide, el precio por asiento es de 6 a 9 €. El tren Bilbao–Burgos + autobús Burgos–Aranda es una alternativa pero con horarios muy restringidos."
      }
    ],
    relatedFestivals: ["mad-cool", "vina-rock", "bbk-live"]
  },
  {
    slug: "zevra-festival",
    name: "Zevra Festival",
    shortName: "Zevra",
    city: "Valencia",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "La Marina de Valencia",
    venueAddress: "La Marina de València, Moll de la Duana, 46024 Valencia",
    lat: 39.457,
    lng: -0.336,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    typicalDates: "Verano 2026 (julio–agosto)",
    capacity: "20.000 personas/día",
    blurb: "Zevra Festival es el festival urbano de referencia de Valencia, celebrado en La Marina de València con vistas privilegiadas al puerto mediterráneo. Combina música electrónica, indie y pop en un entorno singular junto al mar, con capacidad para 20.000 asistentes diarios. El recinto es accesible en metro (línea L4, paradas Marítim-Serreria o Neptú) y en autobús de la EMT desde el centro de Valencia, pero los asistentes de Madrid (355 km por la A-3), Murcia (210 km por la A-7) o Alicante (175 km por la A-7) prefieren el carpooling con ConcertRide para llegar directamente sin transbordos y organizar la vuelta a cualquier hora de la madrugada.",
    originCities: [
      { city: "Valencia (centro)", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 210, drivingTime: "2h", concertRideRange: "7–10 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Zevra Festival desde Madrid?",
        a: "Madrid–La Marina de Valencia son 355 km (3h 20 min por la A-3). Con ConcertRide, el precio por asiento desde Madrid está entre 10 y 14 €. El AVE Madrid–Valencia cuesta entre 25 y 60 € y requiere transporte adicional hasta La Marina (metro L4 o taxi, unos 20 minutos desde la estación de Joaquín Sorolla)."
      },
      {
        q: "¿Hay transporte público a Zevra Festival desde el centro de Valencia?",
        a: "Sí, La Marina de Valencia es accesible en metro (línea L4, parada Marítim-Serreria o Neptú, a 5–8 minutos a pie del recinto) y en autobús de la EMT (líneas 19 y 95 en horario diurno). En noches de festival, el metro L4 amplía el servicio hasta las 1:00–2:00. Los que vienen de fuera de Valencia prefieren ConcertRide para llegar directamente sin combinaciones."
      },
      {
        q: "¿Hay parking en La Marina de Valencia?",
        a: "La Marina de Valencia dispone de un parking público en el Moll de la Duana (aprox. 2–3 €/hora) y zonas de aparcamiento en la zona portuaria. En días de festival el parking se llena rápido. Para asistentes de fuera de Valencia, es más práctico llegar con ConcertRide o aparcar en el barrio de Quatre Carreres y tomar el metro L4."
      },
      {
        q: "¿Cómo ir a Zevra Festival desde Barcelona?",
        a: "Barcelona–La Marina de Valencia son 355 km (3h 20 min por la AP-7 y la A-3). Con ConcertRide, el precio por asiento desde Barcelona está entre 10 y 14 €. El tren AVE Barcelona–Valencia tarda 3h y cuesta entre 20 y 55 €, pero requiere metro adicional hasta La Marina."
      },
      {
        q: "¿Cómo ir a Zevra Festival desde Alicante?",
        a: "Alicante–La Marina de Valencia son 175 km (1h 45 min por la A-7). Con ConcertRide, el precio por asiento desde Alicante está entre 5 y 8 €. El tren Alicante–Valencia (Euromed o MD) tarda entre 1h 30 min y 2h y cuesta entre 10 y 25 €, pero las frecuencias nocturnas son limitadas."
      },
      {
        q: "¿Cuáles son los horarios de Zevra Festival 2026?",
        a: "Los horarios de Zevra Festival 2026 aún están por confirmar. En ediciones anteriores, los conciertos comenzaban a las 19:00–20:00 y los últimos bolos terminaban entre las 2:00 y las 4:00. El metro L4 de Valencia amplía su servicio hasta las 1:00–2:00 en noches de festival, pero no cubre las salidas de madrugada más tardías. Para la vuelta a cualquier hora, ConcertRide permite coordinar el regreso directamente con el conductor, sin depender de los últimos metros ni de taxis con tarifa nocturna (30–50 € desde La Marina al centro)."
      },
      {
        q: "¿Hay bus a Zevra Festival desde el centro de Valencia?",
        a: "Sí, La Marina de Valencia está bien comunicada en transporte público. El metro línea L4 (paradas Marítim-Serreria o Neptú) tarda unos 15 minutos desde el centro y cuesta 1,50 €. Las líneas de autobús EMT 19 y 95 también paran cerca del recinto en horario diurno y parte del nocturno. Para los que vienen de fuera de Valencia (Madrid, Alicante, Murcia, Barcelona), ConcertRide es la opción más directa: el conductor lleva al pasajero hasta La Marina sin transbordos."
      },
      {
        q: "¿Hay bus desde Madrid a Zevra Festival?",
        a: "No existe autobús directo Madrid–Zevra Festival. El AVE Madrid–Valencia (Estación Joaquín Sorolla) tarda 1h 40 min y cuesta entre 25 y 60 €, con metro adicional hasta La Marina (20 min, L4). Con ConcertRide, el viaje completo Madrid–La Marina cuesta entre 10 y 14 € por asiento. Para la vuelta de madrugada, el AVE nocturno puede no coincidir con los horarios del festival — el carpooling es la única opción flexible."
      },
      {
        q: "¿Cuándo es Zevra Festival 2026?",
        a: "Las fechas exactas de Zevra Festival 2026 aún están por confirmar. Se espera en verano (julio–agosto) en La Marina de Valencia. Consulta concertride.me para viajes disponibles cuando se anuncie el cartel."
      }
    ],
    relatedFestivals: ["medusa-festival", "arenal-sound", "fib"]
  },
  {
    slug: "low-festival",
    name: "Low Festival",
    shortName: "Low Festival",
    city: "Benidorm",
    citySlug: "malaga",
    region: "Comunidad Valenciana",
    venue: "Balneario de la Paloma",
    venueAddress: "Av. de la Comunitat Valenciana, 03503 Benidorm, Alicante",
    lat: 38.541,
    lng: 0.123,
    startDate: "2026-07-24",
    endDate: "2026-07-26",
    typicalDates: "Finales de julio (edición 2026: 24–26 julio)",
    capacity: "20.000 personas/día",
    blurb: "Low Festival es el festival indie de Benidorm, celebrado junto al mar en la costa alicantina desde 2012. Combina artistas de pop independiente, folk y alternativo en un ambiente familiar y luminoso a pie de playa. El recinto del Balneario de la Paloma está en el paseo marítimo de Benidorm, a 45 km de Alicante (por la A-70 y la N-332) y a 150 km de Valencia (por la AP-7). Benidorm tiene conexión de TRAM Metropolità d'Alacant desde Alicante (línea L1, 1h 20 min, frecuencia horaria), pero el servicio se interrumpe cerca de la medianoche, lo que deja sin transporte a los asistentes que salen de los conciertos a las 2:00–3:00. Los fans de Valencia, Madrid o Murcia llegan habitualmente en coche compartido con ConcertRide.",
    originCities: [
      { city: "Alicante", km: 45, drivingTime: "35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Valencia", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Madrid", km: 440, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 500, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Low Festival desde Alicante?",
        a: "Alicante está a 45 km de Benidorm (35 minutos por la A-70 y la N-332). El TRAM Metropolità d'Alacant (línea L1, parada Benidorm) conecta Alicante con Benidorm en 1h 20 min con frecuencia horaria, pero el último tren sale antes de la medianoche. Con ConcertRide, el precio por asiento desde Alicante es de 3 a 5 € y puedes volver a la hora que quieras."
      },
      {
        q: "¿Hay parking en el Balneario de la Paloma (Low Festival)?",
        a: "El paseo marítimo de Benidorm donde se celebra Low Festival tiene aparcamiento muy limitado en días de festival. Los parkings más cercanos son el Parking Levante (Av. del Mediterrani) y el subterráneo de la Plaça del Cònsol, a 5–10 minutos a pie del recinto (3–5 €/hora). Para asistentes que vienen de fuera, lo más práctico es aparcar en el centro de Benidorm y caminar, o llegar directamente con ConcertRide."
      },
      {
        q: "¿Hay shuttle desde Valencia a Low Festival?",
        a: "Low Festival no dispone de shuttle oficial desde Valencia. El autobús de línea Valencia–Benidorm (empresa ALSA o Avanzabus, 2h, 10–18 €) opera varias veces al día pero no en horarios de madrugada. ConcertRide es la alternativa más práctica: el precio por asiento desde Valencia es de 5 a 8 € y puedes coordinar la vuelta a cualquier hora."
      },
      {
        q: "¿Cómo ir a Low Festival desde Madrid?",
        a: "Madrid–Benidorm son 440 km (4 horas por la A-3 y la A-70). Con ConcertRide, el precio por asiento desde Madrid está entre 12 y 17 €. El autobús de larga distancia Madrid–Benidorm (ALSA) tarda entre 5 y 6h y cuesta entre 20 y 35 €, pero no cubre horarios de madrugada."
      },
      {
        q: "¿Cómo ir a Low Festival desde Barcelona?",
        a: "Barcelona–Benidorm son 500 km (4h 30 min por la AP-7 y la A-70). Con ConcertRide, el precio por asiento desde Barcelona está entre 13 y 18 €. El tren Barcelona–Alicante + TRAM hasta Benidorm es una alternativa viable para el viaje de ida, pero la vuelta de madrugada es imposible en transporte público."
      },
      {
        q: "¿Hay transporte desde Valencia a Low Festival?",
        a: "Valencia–Benidorm son 150 km (1h 30 min por la AP-7). Con ConcertRide, el viaje cuesta entre 5 y 8 € por asiento. El autobús Valencia–Benidorm existe pero no cubre horarios de festival."
      },
      {
        q: "¿Cuándo es Low Festival 2026?",
        a: "Low Festival 2026 está previsto para el 24, 25 y 26 de julio en el Balneario de la Paloma, Benidorm (Alicante). Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["fib", "arenal-sound", "medusa-festival"]
  },
  {
    slug: "tomavistas",
    name: "Tomavistas Festival",
    shortName: "Tomavistas",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "IFEMA Madrid",
    venueAddress: "Av. del Partenón, 5, 28042 Madrid",
    lat: 40.464,
    lng: -3.61,
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    typicalDates: "Segunda quincena de mayo (edición 2026: 15–17 mayo)",
    capacity: "25.000 personas/día",
    blurb: "Tomavistas es el festival de indie y pop alternativo de Madrid, celebrado en primavera con artistas de primer nivel nacional e internacional desde 2014. Ha consolidado su cita como la apertura de la temporada de festivales madrileña, con 25.000 asistentes diarios en IFEMA. El recinto comparte las mismas limitaciones de transporte nocturno que Mad Cool: el último metro (línea 8, estación Feria de Madrid) cierra sobre la 1:30, y los autobuses nocturnos N1 y N6 no llegan directamente a IFEMA, dejando a los asistentes de provincias sin alternativa de transporte público. Con ConcertRide, quienes llegan desde Toledo, Guadalajara, Valencia o Zaragoza pueden organizar el viaje de ida y vuelta sin depender del transporte público madrileño.",
    originCities: [
      { city: "Centro de Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo ir a Tomavistas desde el centro de Madrid?",
        a: "El acceso es el mismo que Mad Cool: metro línea 8 (dirección Aeropuerto T4) hasta la estación Feria de Madrid (25 minutos desde Sol). A la salida (madrugada), el metro cierra sobre la 1:30 y el carpooling es la opción más cómoda para volver. ConcertRide conecta asistentes del mismo barrio o ciudad desde 4 €."
      },
      {
        q: "¿Hay transporte público nocturno de vuelta de Tomavistas?",
        a: "El metro línea 8 tiene la última salida desde Feria de Madrid alrededor de la 1:30 (con posibles ampliaciones en noches de festival). Los autobuses nocturnos N1 y N6 cubren la Avenida de América pero no paran en IFEMA directamente. Taxi y VTC desde IFEMA al centro cuestan entre 15 y 25 € en horario normal y hasta 50 € en hora punta. ConcertRide permite organizar el regreso con asistentes de la misma zona por 4–7 €."
      },
      {
        q: "¿Hay lanzadera oficial o shuttle de Tomavistas?",
        a: "Tomavistas no opera lanzaderas propias desde el centro de Madrid. La Metro Línea 8 es el único transporte oficial directo. Los asistentes de otras ciudades tienen como mejor opción ConcertRide para coordinar el viaje completo."
      },
      {
        q: "¿Hay parking en IFEMA durante Tomavistas?",
        a: "IFEMA dispone de varias zonas de parking (12–18 €/día), pero los accesos por la R-2 y la M-14 pueden congestionarse en las llegadas. Muchos conductores de fuera de Madrid prefieren aparcar en el intercambiador de Avenida de América y tomar la línea 8. Con ConcertRide, llegas directamente sin preocuparte del parking."
      },
      {
        q: "¿Cómo ir a Tomavistas desde Valencia?",
        a: "Valencia–Madrid son 355 km (3h 20 min por la A-3). Con ConcertRide, el precio por asiento desde Valencia es de 10 a 14 €. El AVE tarda 1h 35 min pero cuesta entre 25 y 60 € y no llega a IFEMA; hay que añadir metro L8 (25 min) desde Atocha."
      },
      {
        q: "¿Cuándo es Tomavistas 2026?",
        a: "Tomavistas Festival 2026 está previsto para el 15, 16 y 17 de mayo en IFEMA, Madrid. Busca viajes en concertride.me."
      }
    ],
    relatedFestivals: ["mad-cool", "sonorama-ribera"]
  },
  {
    slug: "cruilla",
    name: "Cruïlla Barcelona",
    shortName: "Cruïlla",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    venue: "Parc del Fòrum",
    venueAddress: "Rambla del Prim, 2-4, 08019 Barcelona",
    lat: 41.4066,
    lng: 2.2218,
    startDate: "2026-07-09",
    endDate: "2026-07-12",
    typicalDates: "Segunda semana de julio (edición 2026: 9–12 julio)",
    capacity: "30.000 personas/día",
    blurb: "Cruïlla Barcelona es el festival de música del mundo, pop y alternativo más ecléctico del verano barcelonés, celebrado cada julio en el Parc del Fòrum desde 2008. Combina artistas de world music, reggae, hip-hop, pop y rock en cuatro días en el mismo espacio portuario de Sant Adrià de Besòs que alberga Primavera Sound, con 30.000 asistentes diarios y un ambiente familiar. El recinto comparte la misma situación de transporte que Primavera Sound: el metro L4 (parada Besòs Mar) llega al Fòrum en 10 minutos a pie, pero las salidas de madrugada generan colas de 30–45 minutos, y los asistentes de Madrid, Valencia o Zaragoza que vienen expresamente para el festival prefieren el carpooling con ConcertRide para llegar directamente y organizar la vuelta de forma flexible.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" }
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Cruïlla desde Madrid?",
        a: "Madrid–Barcelona (Parc del Fòrum) son 620 km (5h 30 min en coche por la AP-2). Con ConcertRide, el precio por asiento desde Madrid está entre 15 y 20 €. El AVE Madrid–Barcelona cuesta entre 50 y 100 € y no llega al Fòrum; hay que añadir metro L4 (parada Besòs Mar) desde la Estació de Sants, unos 35 minutos más. Muchos fans madrileños combinen Cruïlla con Primavera Sound o Sónar y se quedan en Barcelona varios días."
      },
      {
        q: "¿Qué metro va al Parc del Fòrum para Cruïlla?",
        a: "El metro de Barcelona línea L4 (amarilla) tiene la parada Besòs Mar a unos 10 minutos a pie del recinto del Fòrum. En noches de festival TMB amplía el servicio hasta las 3:00–4:00. También pasan los buses nocturnos N6 y N7 por la Rambla del Prim. Las salidas de madrugada pueden generar colas de 30–45 minutos, por lo que muchos asistentes coordinan su regreso con ConcertRide."
      },
      {
        q: "¿Hay parking en el Parc del Fòrum para Cruïlla?",
        a: "El parking del Parc del Fòrum es muy limitado durante el festival (máximo 500 plazas, 25–35 €/día). La organización desaconseja venir en coche particular al recinto y recomienda el transporte público. Para quienes vienen de fuera de Barcelona, lo más habitual es aparcar en el área metropolitana (Badalona, Sant Adrià de Besòs) y tomar el metro L4, o llegar directamente con conductor de ConcertRide."
      },
      {
        q: "¿Hay shuttle oficial de Cruïlla?",
        a: "Cruïlla no opera un shuttle oficial de larga distancia desde otras ciudades. Los asistentes que vienen de fuera de Cataluña utilizan principalmente el AVE o el coche compartido. ConcertRide es la alternativa más flexible para quienes prefieren llegar directamente al Fòrum desde su ciudad de origen."
      },
      {
        q: "¿Cuánto cuesta ir a Cruïlla desde Valencia?",
        a: "Valencia–Barcelona (Parc del Fòrum) son 355 km (3h 15 min por la AP-7). Con ConcertRide, el precio por asiento desde Valencia está entre 10 y 14 €. El tren AVE Valencia–Barcelona cuesta entre 20 y 60 € y tarda 3h, pero hay que añadir metro hasta el Fòrum desde Sants (35 min). El carpooling permite llegar directamente con todo el equipaje."
      },
      {
        q: "¿En qué fechas es Cruïlla 2026?",
        a: "Cruïlla Barcelona 2026 está previsto para el 9, 10, 11 y 12 de julio en el Parc del Fòrum de Barcelona. Busca viajes en concertride.me para esas fechas."
      }
    ],
    relatedFestivals: ["primavera-sound", "sonar"]
  }
];
const FESTIVAL_LANDINGS_BY_SLUG = Object.fromEntries(
  FESTIVAL_LANDINGS.map((f) => [f.slug, f])
);
function trackFestivalView(slug, name, futureRides) {
}
function trackCityView(slug, name, concertCount) {
}
function trackRouteSearch(origin, destination, dateFrom) {
}
function trackBlogView(slug, title) {
}
function trackAlertSubscribe(festivalSlug, email_hash) {
}
function CityLandingPage() {
  const { city: slug } = useParams();
  const landing = slug ? CITY_LANDINGS_BY_SLUG[slug] : void 0;
  const [concerts, setConcerts] = useState(null);
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  useSeoMeta({
    title: landing ? `Conciertos en ${landing.display} ${year}` : "Conciertos por ciudad",
    description: landing ? `Conciertos y festivales en ${landing.display} ${year}: ${landing.venues.slice(0, 3).join(", ")} y más. Carpooling para llegar desde cualquier ciudad de España, sin taxi ni comisiones.` : "Explora conciertos por ciudad en España.",
    canonical: landing ? `${SITE_URL}/conciertos/${landing.slug}` : `${SITE_URL}/concerts`,
    keywords: landing ? `conciertos en ${landing.display}, conciertos ${landing.display} ${year}, próximos conciertos ${landing.display}, música ${landing.display}, festivales ${landing.display}, carpooling ${landing.display}, coche compartido ${landing.display}, cómo ir al concierto ${landing.display}` : void 0
  });
  useEffect(() => {
    if (!landing) return;
    setConcerts(null);
    api.concerts.list({
      city: landing.city,
      date_from: (/* @__PURE__ */ new Date()).toISOString(),
      limit: 50
    }).then((r) => {
      setConcerts(r.concerts);
      trackCityView(landing.slug, landing.display, r.concerts.filter((c) => new Date(c.date).getTime() > Date.now()).length);
    }).catch(() => {
      setConcerts([]);
      trackCityView(landing.slug, landing.display);
    });
  }, [landing]);
  if (!slug || !landing) return /* @__PURE__ */ jsx(Navigate, { to: "/concerts", replace: true });
  const futureConcerts = (concerts ?? []).filter(
    (c) => new Date(c.date).getTime() > Date.now()
  );
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Conciertos en ${landing.display}`,
            url: `${SITE_URL}/conciertos/${landing.slug}`,
            inLanguage: "es-ES",
            dateModified: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
            description: landing.blurb,
            about: {
              "@type": "Place",
              name: landing.display,
              address: {
                "@type": "PostalAddress",
                addressLocality: landing.display,
                addressRegion: landing.region,
                addressCountry: "ES"
              }
            },
            isPartOf: {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "ConcertRide ES",
              url: SITE_URL
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: futureConcerts.length,
              itemListElement: futureConcerts.slice(0, 20).map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/concerts/${c.id}`,
                name: `${c.artist} — ${c.venue.name}`
              }))
            }
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
              {
                "@type": "ListItem",
                position: 3,
                name: landing.display,
                item: `${SITE_URL}/conciertos/${landing.slug}`
              }
            ]
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OnlineBusiness",
            "@id": `${SITE_URL}/conciertos/${landing.slug}#onlinebusiness`,
            name: `ConcertRide — Carpooling para conciertos en ${landing.display}`,
            description: landing.blurb,
            url: `${SITE_URL}/conciertos/${landing.slug}`,
            logo: `${SITE_URL}/favicon.svg`,
            image: `${SITE_URL}/og/home.png`,
            priceRange: "€3–€35",
            currenciesAccepted: "EUR",
            paymentAccepted: "Cash, Bizum",
            areaServed: {
              "@type": "City",
              name: landing.display,
              sameAs: `https://www.wikidata.org/wiki/Special:Search/${encodeURIComponent(landing.display)}`
            },
            sameAs: [
              "https://twitter.com/concertride_es",
              "https://www.instagram.com/concertride_es/"
            ]
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxs(
        "nav",
        {
          "aria-label": "Breadcrumb",
          className: "font-mono text-[11px] text-cr-text-dim flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
            /* @__PURE__ */ jsx(Link, { to: "/concerts", className: "hover:text-cr-primary", children: "Conciertos" }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
            /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: landing.display })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(MapPin, { size: 12 }),
        " ",
        landing.region
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        "Conciertos en ",
        landing.display,
        "."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: landing.blurb }),
      landing.venues.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 pt-2", children: landing.venues.map((v) => /* @__PURE__ */ jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1",
          children: [
            /* @__PURE__ */ jsx(Music2, { size: 10 }),
            " ",
            v
          ]
        },
        v
      )) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-xl md:text-2xl uppercase mb-6", children: "Próximos conciertos" }),
      concerts === null ? /* @__PURE__ */ jsx(LoadingSpinner, { text: `Cargando conciertos en ${landing.display}…` }) : futureConcerts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-10 text-center space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase text-cr-text-muted", children: "Sin conciertos programados ahora mismo" }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-dim", children: "Pronto añadiremos eventos. Mientras tanto:" }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/concerts",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
            children: "Ver todos los conciertos →"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: futureConcerts.map((c) => /* @__PURE__ */ jsx(Link, { to: `/concerts/${c.id}`, className: "block", children: /* @__PURE__ */ jsx(ConcertCard, { concert: c }) }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-xl md:text-2xl uppercase", children: [
        "Cómo ir a un concierto en ",
        landing.display
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed", children: [
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "1. Busca el concierto" }),
          /* @__PURE__ */ jsx("p", { children: "Encuentra el evento al que vas en esta página. Cada ficha muestra cuántos viajes compartidos están ya publicados desde distintas ciudades de España." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "2. Elige un viaje" }),
          /* @__PURE__ */ jsx("p", { children: "Revisa precio por plaza, vibe (party/chill/mixed) y la valoración del conductor. Puedes ver qué otros pasajeros ya están confirmados." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "3. Llega juntos" }),
          /* @__PURE__ */ jsx("p", { children: "Pagas al conductor en efectivo o Bizum el día del viaje. Recibes un recordatorio 24h antes con la hora y el punto de encuentro." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 flex flex-wrap gap-4 border-t border-cr-border", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/concerts",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
            children: [
              "Ver todas las ciudades ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/como-funciona",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
            children: [
              "Cómo funciona ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/faq",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors ml-auto",
            children: [
              "FAQ ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        )
      ] })
    ] }),
    (() => {
      const cityFestivals = FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug);
      if (cityFestivals.length === 0) return null;
      return /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-lg uppercase text-cr-text-muted mb-4", children: [
          "Festivales en ",
          landing.display
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-2", children: cityFestivals.map((f) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/festivales/${f.slug}`,
            className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
            children: [
              "Cómo ir a ",
              f.shortName,
              " →"
            ]
          }
        ) }, f.slug)) })
      ] });
    })(),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted mb-4", children: "Otras ciudades" }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-2", children: CITY_LANDINGS.filter((c) => c.slug !== landing.slug).map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        Link,
        {
          to: `/conciertos/${c.slug}`,
          className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
          children: c.display
        }
      ) }, c.slug)) })
    ] })
  ] });
}
function FestivalAlertWidget({ festivalSlug, festivalName }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await api.alerts.subscribeFestival(email.trim(), festivalSlug);
      if (!res.created) {
        setState("duplicate");
      } else {
        setState("done");
        trackAlertSubscribe(festivalSlug);
      }
    } catch {
      setState("error");
    }
  }
  if (state === "done") {
    return /* @__PURE__ */ jsxs("div", { className: "border border-cr-primary/40 bg-cr-primary/5 p-5 space-y-1", children: [
      /* @__PURE__ */ jsx("p", { className: "font-display text-base uppercase text-cr-primary", children: "¡Listo!" }),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: [
        "Te avisaremos en ",
        /* @__PURE__ */ jsx("span", { className: "text-cr-text", children: email }),
        " cuando aparezcan viajes compartidos a ",
        festivalName,
        "."
      ] })
    ] });
  }
  if (state === "duplicate") {
    return /* @__PURE__ */ jsx("div", { className: "border border-cr-border p-5 space-y-1", children: /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: [
      "Este email ya está suscrito a alertas de ",
      festivalName,
      "."
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "border border-cr-border p-5 space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(Bell, { size: 16, className: "text-cr-primary mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-base uppercase", children: "Avísame cuando haya viajes" }),
        /* @__PURE__ */ jsxs("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed", children: [
          "Recibe un email cuando alguien publique un viaje compartido a ",
          festivalName,
          ". Sin spam — solo una notificación por festival."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          required: true,
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: "tu@email.com",
          className: "flex-1 min-w-0 bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary/60 transition-colors",
          disabled: state === "loading"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: state === "loading" || !email.trim(),
          className: "font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          children: state === "loading" ? "…" : "Activar alerta"
        }
      )
    ] }),
    state === "error" && /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-cr-secondary", children: "Error al guardar. Inténtalo de nuevo." }),
    /* @__PURE__ */ jsxs("p", { className: "font-mono text-[10px] text-cr-text-dim leading-relaxed", children: [
      "Al suscribirte aceptas recibir un email de ConcertRide. Puedes cancelar en cualquier momento.",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/privacidad", className: "underline underline-offset-2 hover:text-cr-primary transition-colors", children: "Privacidad" }),
      "."
    ] })
  ] });
}
const FESTIVAL_DEFAULT_OG = `${SITE_URL}/og/festival-default.png`;
function FestivalLandingPage() {
  var _a2, _b, _c, _d;
  const { festival: slug } = useParams();
  const festival = slug ? FESTIVAL_LANDINGS_BY_SLUG[slug] : void 0;
  const [concerts, setConcerts] = useState(null);
  const festivalOgImage = (festival == null ? void 0 : festival.ogImage) ?? FESTIVAL_DEFAULT_OG;
  useSeoMeta({
    title: festival ? `Cómo ir a ${festival.shortName} ${(/* @__PURE__ */ new Date()).getFullYear()} — Carpooling desde toda España` : "Festivales de música en España",
    description: festival ? `Carpooling a ${festival.name} desde ${festival.originCities.slice(0, 3).map((c) => c.city).join(", ")} y más ciudades. Precios desde ${((_a2 = festival.originCities[0]) == null ? void 0 : _a2.concertRideRange) ?? "3 €"}/asiento. Sin taxi, sin comisión. Conductores verificados.` : "Carpooling a festivales de música en España con ConcertRide.",
    canonical: festival ? `${SITE_URL}/festivales/${festival.slug}` : `${SITE_URL}/concerts`,
    ogImage: festivalOgImage,
    ogType: "music.event",
    keywords: festival ? `cómo ir a ${festival.shortName}, cómo llegar a ${festival.shortName}, transporte ${festival.shortName}, carpooling ${festival.name}, coche compartido ${festival.shortName}, ${festival.shortName} ${festival.city}, viaje compartido ${festival.shortName} 2026, compartir coche ${festival.shortName}, alternativa taxi ${festival.shortName}, ir a ${festival.shortName} sin coche, precio carpooling ${festival.shortName}` : void 0
  });
  useEffect(() => {
    if (!festival) return;
    setConcerts(null);
    api.concerts.list({
      city: festival.city,
      date_from: (/* @__PURE__ */ new Date()).toISOString(),
      limit: 12
    }).then((r) => {
      setConcerts(r.concerts);
      trackFestivalView(festival.slug, festival.name, r.concerts.filter((c) => new Date(c.date).getTime() > Date.now()).length);
    }).catch(() => {
      setConcerts([]);
      trackFestivalView(festival.slug, festival.name);
    });
  }, [festival]);
  if (!slug || !festival) return /* @__PURE__ */ jsx(Navigate, { to: "/concerts", replace: true });
  const futureConcerts = (concerts ?? []).filter(
    (c) => new Date(c.date).getTime() > Date.now()
  );
  const relatedFestivals = FESTIVAL_LANDINGS.filter(
    (f) => festival.relatedFestivals.includes(f.slug)
  );
  const festivalPlace = {
    "@type": "Place",
    name: festival.venue,
    address: {
      "@type": "PostalAddress",
      streetAddress: festival.venueAddress,
      addressLocality: festival.city,
      addressRegion: festival.region,
      addressCountry: "ES"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: festival.lat,
      longitude: festival.lng
    }
  };
  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: festival.name,
    url: `${SITE_URL}/festivales/${festival.slug}`,
    image: festivalOgImage,
    description: festival.blurb,
    startDate: festival.startDate,
    endDate: festival.endDate,
    location: festivalPlace,
    performer: {
      "@type": "PerformingGroup",
      name: festival.name
    },
    organizer: {
      "@type": "Organization",
      name: festival.name
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    typicalAgeRange: "18-",
    inLanguage: "es",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/festivales/${festival.slug}`,
      price: ((_d = (_c = (_b = festival.originCities[0]) == null ? void 0 : _b.concertRideRange) == null ? void 0 : _c.split("–")[0]) == null ? void 0 : _d.replace(/[^0-9]/g, "")) ?? "3",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: (/* @__PURE__ */ new Date()).toISOString(),
      description: "Carpooling desde toda España con ConcertRide"
    }
  };
  const jsonLdSeries = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: festival.name,
    url: `${SITE_URL}/festivales/${festival.slug}`,
    description: festival.blurb,
    startDate: festival.startDate,
    endDate: festival.endDate,
    location: festivalPlace,
    eventSchedule: {
      "@type": "Schedule",
      repeatFrequency: "P1Y"
    },
    organizer: {
      "@type": "Organization",
      name: festival.name
    },
    inLanguage: "es"
  };
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Conciertos y festivales", item: `${SITE_URL}/concerts` },
      {
        "@type": "ListItem",
        position: 3,
        name: festival.name,
        item: `${SITE_URL}/festivales/${festival.slug}`
      }
    ]
  };
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdEvent) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdSeries) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdBreadcrumb) } }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/concerts", className: "hover:text-cr-primary", children: "Conciertos" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: festival.shortName })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(MapPin, { size: 12 }),
        " ",
        festival.region
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        "Cómo ir a",
        /* @__PURE__ */ jsx("br", {}),
        festival.shortName,
        "."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: festival.blurb }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 pt-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 10 }),
          " ",
          festival.venue
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 10 }),
          " ",
          festival.typicalDates
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1", children: [
          /* @__PURE__ */ jsx(Users, { size: 10 }),
          " ",
          festival.capacity
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-2xl md:text-3xl uppercase mb-2", children: [
        "Precios de carpooling a ",
        festival.shortName
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted mb-8 max-w-xl", children: "Precio medio por asiento con ConcertRide desde las principales ciudades de origen. El 100 % va al conductor, sin comisión." }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: festival.originCities.map((oc) => /* @__PURE__ */ jsxs(
        "article",
        {
          className: "border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase", children: oc.city }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xs text-cr-primary font-semibold", children: oc.concertRideRange })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 font-mono text-[11px] text-cr-text-muted", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                oc.km,
                " km"
              ] }),
              /* @__PURE__ */ jsx("span", { children: "·" }),
              /* @__PURE__ */ jsx("span", { children: oc.drivingTime })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] text-cr-text-muted", children: "sin comisión — pagas directamente al conductor" })
          ]
        },
        oc.city
      )) }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 p-4 border border-cr-primary/30 bg-cr-primary/5 space-y-1", children: /* @__PURE__ */ jsxs("p", { className: "font-sans text-xs text-cr-text-muted", children: [
        /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Precios orientativos" }),
        " basados en tarifas reales publicadas en ConcertRide. El conductor fija el precio por asiento para cubrir combustible y peajes (tarifa MITECO de referencia)."
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-2xl md:text-3xl uppercase mb-2", children: [
        "Viajes disponibles en ",
        festival.city
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted mb-8 max-w-xl", children: [
        "Conciertos y eventos en ",
        festival.city,
        " con viajes compartidos publicados."
      ] }),
      concerts === null ? /* @__PURE__ */ jsx(LoadingSpinner, { text: `Cargando viajes a ${festival.shortName}…` }) : futureConcerts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-10 text-center space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase text-cr-text-muted", children: "Aún no hay viajes publicados" }),
        /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
          "Sé el primero en publicar un viaje a ",
          festival.shortName,
          "."
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/publish",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
            children: "Publicar viaje →"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: futureConcerts.map((c) => /* @__PURE__ */ jsx(Link, { to: `/concerts/${c.id}`, className: "block", children: /* @__PURE__ */ jsx(ConcertCard, { concert: c }) }, c.id)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: /* @__PURE__ */ jsx(FestivalAlertWidget, { festivalSlug: festival.slug, festivalName: festival.shortName }) }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: [
        "Por qué ir a ",
        festival.shortName,
        " con ConcertRide"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed", children: [
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Sin intermediarios" }),
          /* @__PURE__ */ jsx("p", { children: "El 100 % del precio del asiento va al conductor. ConcertRide no cobra comisión, nunca. El pago es en efectivo o Bizum el día del viaje: económico, directo y sin sorpresas." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Conductores verificados" }),
          /* @__PURE__ */ jsx("p", { children: "Todos los conductores verifican su carnet de conducir antes de publicar. Puedes ver sus valoraciones y reseñas de otros pasajeros." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Horario flexible" }),
          /* @__PURE__ */ jsx("p", { children: "Llegas y vuelves en el horario que quieras. No dependes del último metro ni de taxis a precio de festival (30–90 € de madrugada)." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 flex flex-wrap gap-4 border-t border-cr-border", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/conciertos/${festival.citySlug}`,
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
            children: [
              "Todos los conciertos en ",
              festival.city,
              " ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/como-funciona",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
            children: [
              "Cómo funciona ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/publish",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary hover:text-cr-primary/80 transition-colors ml-auto",
            children: [
              "Publicar un viaje ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: [
        "Cómo reservar un viaje a ",
        festival.shortName,
        " en 4 pasos"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        { n: "01", title: "Busca el festival", body: `Entra en concertride.me/concerts y filtra por ${festival.city} o busca directamente "${festival.shortName}".` },
        { n: "02", title: "Elige el viaje", body: "Compara precio por asiento, hora de salida y perfil del conductor. Lee las valoraciones de otros pasajeros." },
        { n: "03", title: "Solicita tu plaza", body: "Con reserva instantánea queda confirmada al momento. Sin ella, el conductor suele responder en pocas horas." },
        { n: "04", title: "Viaja y paga", body: "El día del festival te encuentras con el conductor en el punto acordado. Pagas en efectivo o Bizum. Sin comisión." }
      ].map(({ n, title, body }) => /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-4 space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-cr-primary", children: n }),
        /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase", children: title }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed", children: body })
      ] }, n)) }),
      /* @__PURE__ */ jsxs("blockquote", { className: "border-l-2 border-cr-primary pl-5 space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted italic leading-relaxed", children: '"El 80 % de la huella de carbono de un festival proviene del transporte de los asistentes. El carpooling es la acción individual más efectiva para reducirla."' }),
        /* @__PURE__ */ jsxs("footer", { className: "font-mono text-[11px] text-cr-text-dim", children: [
          "—",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://juliesbicycle.com/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-cr-primary", children: "Julie's Bicycle Practical Guide to Green Events" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: [
        "Preguntas frecuentes — ",
        festival.shortName
      ] }),
      /* @__PURE__ */ jsx("dl", { className: "space-y-6", children: festival.faqs.map((faq) => /* @__PURE__ */ jsxs("div", { className: "border-b border-cr-border pb-6 space-y-2", children: [
        /* @__PURE__ */ jsx("dt", { className: "font-display text-base uppercase text-cr-text", children: faq.q }),
        /* @__PURE__ */ jsx("dd", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl", children: faq.a })
      ] }, faq.q)) })
    ] }),
    relatedFestivals.length > 0 && /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted mb-4", children: "Festivales relacionados" }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-2", children: relatedFestivals.map((f) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/festivales/${f.slug}`,
          className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
          children: [
            f.shortName,
            " — ",
            f.city
          ]
        }
      ) }, f.slug)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted mb-4", children: "Otros festivales en ConcertRide" }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-2", children: FESTIVAL_LANDINGS.filter((f) => f.slug !== festival.slug).map((f) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        Link,
        {
          to: `/festivales/${f.slug}`,
          className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
          children: f.shortName
        }
      ) }, f.slug)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "max-w-6xl mx-auto px-6 pb-10 border-t border-cr-border pt-8", children: /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-dim leading-relaxed", children: [
      "ConcertRide no es un socio oficial, patrocinador ni representante de",
      " ",
      festival.name,
      " ni de su organización. Los nombres de festivales y eventos se utilizan con carácter meramente descriptivo para identificar el destino del viaje. Para la compra de entradas o información oficial acude siempre a la web del organizador.",
      " ",
      /* @__PURE__ */ jsx(Link, { to: "/aviso-legal", className: "underline underline-offset-2 hover:text-cr-primary transition-colors", children: "Aviso legal" }),
      "."
    ] }) })
  ] });
}
const FEATURED_SLUGS = ["mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "arenal-sound"];
function FestivalesPage() {
  useSeoMeta({
    title: "Carpooling para festivales de música en España 2026",
    description: "Viajes compartidos a los mejores festivales de España: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound y más. Sin taxi, sin comisión. Conductores verificados.",
    canonical: `${SITE_URL}/festivales`,
    keywords: "carpooling festivales españa, viaje compartido festival música, cómo ir al festival en coche, transporte festivales 2026, mad cool carpooling, primavera sound viaje compartido, sonar barcelona transporte"
  });
  const featured = FESTIVAL_LANDINGS.filter((f) => FEATURED_SLUGS.includes(f.slug));
  const rest = FESTIVAL_LANDINGS.filter((f) => !FEATURED_SLUGS.includes(f.slug));
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: "Festivales" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Temporada 2026" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        "Carpooling",
        /* @__PURE__ */ jsx("br", {}),
        "para festivales."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: "Encuentra o publica un viaje compartido a cualquier festival de España. Sin comisión, el 100 % del precio va al conductor. Pago en efectivo o Bizum el día del viaje." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/publish",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100",
            children: "Publicar un viaje"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/concerts",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-5 py-2.5 transition-colors",
            children: "Ver conciertos"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase mb-2", children: "Festivales principales" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted mb-8 max-w-xl", children: "Los festivales con mayor demanda de carpooling en ConcertRide." }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: featured.map((f) => {
        var _a2;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/festivales/${f.slug}`,
            className: "group border border-cr-border p-5 space-y-3 hover:border-cr-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-primary", children: f.region }),
                /* @__PURE__ */ jsx("h3", { className: "font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors", children: f.shortName })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 font-mono text-[11px] text-cr-text-muted", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(MapPin, { size: 10 }),
                  " ",
                  f.venue,
                  " · ",
                  f.city
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Calendar, { size: 10 }),
                  " ",
                  f.typicalDates
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] text-cr-text-muted leading-snug line-clamp-2", children: [
                f.blurb.slice(0, 120),
                "…"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-primary font-semibold", children: [
                "Desde ",
                ((_a2 = f.originCities[0]) == null ? void 0 : _a2.concertRideRange) ?? "3 €/asiento",
                " →"
              ] })
            ]
          },
          f.slug
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase mb-2", children: "Más festivales en ConcertRide" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted mb-8 max-w-xl", children: "Carpooling a festivales de todos los géneros y regiones de España." }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: rest.map((f) => {
        var _a2;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/festivales/${f.slug}`,
            className: "group border border-cr-border p-4 flex items-start justify-between gap-4 hover:border-cr-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase truncate group-hover:text-cr-primary transition-colors", children: f.shortName }),
                /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted truncate", children: [
                  f.city,
                  " · ",
                  f.startDate.slice(5, 10).split("-").reverse().join("/")
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-cr-primary font-semibold whitespace-nowrap shrink-0", children: ((_a2 = f.originCities[0]) == null ? void 0 : _a2.concertRideRange) ?? "—" })
            ]
          },
          f.slug
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Por qué carpooling para festivales" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed", children: [
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Sin comisión" }),
          /* @__PURE__ */ jsx("p", { children: "El 100 % del precio va al conductor. ConcertRide no cobra nada. Pago en efectivo o Bizum el día del viaje: directo y sin sorpresas." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Conductores verificados" }),
          /* @__PURE__ */ jsx("p", { children: "Todos los conductores verifican su carnet antes de publicar viajes. Puedes ver valoraciones y reseñas de otros pasajeros." })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Tu horario, tu festival" }),
          /* @__PURE__ */ jsx("p", { children: "Llegas y vuelves cuando quieras. Sin depender del último autobús ni pagar 60 € en taxi de madrugada." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Festivales de música en España con carpooling 2026",
            description: "Lista de festivales de música en España con viajes compartidos disponibles en ConcertRide.",
            url: `${SITE_URL}/festivales`,
            numberOfItems: FESTIVAL_LANDINGS.length,
            itemListElement: FESTIVAL_LANDINGS.map((f, i) => {
              var _a2;
              return {
                "@type": "ListItem",
                position: i + 1,
                name: f.name,
                url: `${SITE_URL}/festivales/${f.slug}`,
                description: `Carpooling a ${f.name} desde ${((_a2 = f.originCities[0]) == null ? void 0 : _a2.city) ?? "toda España"}. ${f.typicalDates}.`
              };
            })
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Festivales", item: `${SITE_URL}/festivales` }
            ]
          })
        }
      }
    )
  ] });
}
const GUIDE_FAQS = [
  {
    q: "¿Cuál es la forma más barata de ir a un festival en España?",
    a: "El carpooling entre particulares. Dividir la gasolina entre 3–4 personas sale a 3–20 €/asiento según la distancia — una de las opciones más económicas disponibles. ConcertRide conecta a fans que van al mismo evento para compartir el viaje sin comisiones ni intermediarios."
  },
  {
    q: "¿Cómo volver de un festival de madrugada?",
    a: "Con ConcertRide, acuerdas la hora de vuelta con el conductor antes del viaje. La mayoría de los conductores publican viajes de ida y vuelta (el concierto acaba a las 2:00, salimos a las 2:30). No dependes del metro (que cierra) ni de taxis de madrugada (x3 precio). Es la solución más usada por los que vienen de fuera de la ciudad del festival."
  },
  {
    q: "¿Son fiables los autobuses organizados a festivales?",
    a: "Existen operadoras privadas que ofrecen autobuses a algunos festivales. Son una opción válida para trayectos concretos desde grandes ciudades, aunque tienen horarios fijos y suelen agotarse. La desventaja: solo ofrecen origen-destino predefinido, el horario de vuelta es fijo, y en temporada alta puede no quedar plaza. El carpooling es más flexible y generalmente más económico."
  },
  {
    q: "¿Es mejor el carpooling o el transporte público para ir a un festival?",
    a: "Depende del festival. Si el recinto está bien comunicado en metro (Parc del Fòrum para Primavera Sound, Fira Gran Via para Sónar), el transporte público es válido para la ida. Pero para la vuelta de madrugada y para festivales en recintos alejados (IFEMA, Kobetamendi, Arenal Sound en Burriana, Resurrection Fest en Viveiro) el carpooling es la única opción práctica."
  },
  {
    q: "¿Cuánto contamina ir a un festival en coche?",
    a: "Un coche individual emite ~150 g CO₂/km. Compartido entre 4 personas, la emisión por pasajero baja a ~37 g CO₂/km — un 75 % menos. Según el Julie's Bicycle Practical Guide to Green Events (referencia estándar del sector), el 80 % de la huella de carbono de un festival proviene del transporte de los asistentes. La Agencia Europea de Medio Ambiente (EEA) confirma que el coche compartido es la forma más eficiente de reducir emisiones del transporte personal en distancias de 50–500 km. Compartir coche con ConcertRide es la acción individual más impactante para reducir tu huella en un festival."
  },
  {
    q: "¿Qué pasa con el parking en los festivales grandes de España?",
    a: "El parking de IFEMA (Mad Cool, Tomavistas) cuesta 12–18 €/día y se satura desde primera hora. Kobetamendi (BBK Live) tiene acceso muy limitado. El Parc del Fòrum (Primavera Sound) no tiene parking masivo. La alternativa es aparcar en polígonos cercanos o, mejor, llegar en carpooling con alguien que conozca el aparcamiento o que te deje en la puerta."
  }
];
function GuiaTransporteFestivalesPage() {
  useSeoMeta({
    title: `Guía de transporte para festivales de España ${(/* @__PURE__ */ new Date()).getFullYear()}`,
    description: "Cómo llegar a los festivales de música en España sin taxi, sin agobios y sin pagar de más. Carpooling, buses, transporte público y todo lo que necesitas saber para 2026.",
    canonical: `${SITE_URL}/guia-transporte-festivales`,
    keywords: "transporte festivales España, cómo ir al festival sin coche, alternativa taxi festival España, autobús festival España, carpooling festival, guía transporte festival 2026, volver festival madrugada, cómo llegar festival España, movilidad sostenible festival, deja tu coche en casa festival, festival sin coche propio, transporte nocturno festival"
  });
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guía de transporte para festivales de España 2026",
    description: "Guía completa: todas las opciones para llegar a los festivales de música en España en 2026 — carpooling, autobuses organizados, transporte público y consejos para volver de madrugada.",
    url: `${SITE_URL}/guia-transporte-festivales`,
    inLanguage: "es-ES",
    author: {
      "@type": "Organization",
      name: "ConcertRide ES",
      url: SITE_URL
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`
    },
    datePublished: "2026-04-24",
    dateModified: "2026-04-29",
    mainEntityOfPage: `${SITE_URL}/guia-transporte-festivales`,
    about: {
      "@type": "Thing",
      name: "Transporte para festivales de música en España"
    }
  };
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guía de transporte para festivales",
        item: `${SITE_URL}/guia-transporte-festivales`
      }
    ]
  };
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdArticle) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdBreadcrumb) } }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx("span", { children: "Guía de transporte" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Guía completa · Edición 2026" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        "Cómo llegar a",
        /* @__PURE__ */ jsx("br", {}),
        "los festivales",
        /* @__PURE__ */ jsx("br", {}),
        "sin pagar de más."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: "Taxi, autobús organizado, metro, carpooling… Cada festival tiene su mejor opción. Esta guía compara todas las alternativas para que llegues al concierto, y vuelvas de madrugada, sin sustos en el precio ni en el horario." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto px-6 py-16 space-y-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl md:text-4xl uppercase", children: "Todas las opciones de transporte a festivales en España" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-primary p-5 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Car, { size: 18, className: "text-cr-primary" }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg uppercase text-cr-primary", children: "Carpooling (ConcertRide)" })
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed", children: [
            /* @__PURE__ */ jsx("li", { children: "✓ Sale desde tu calle o barrio" }),
            /* @__PURE__ */ jsx("li", { children: "✓ Horario de vuelta pactado con el conductor" }),
            /* @__PURE__ */ jsx("li", { children: "✓ Sin comisión — pagas al conductor en persona" }),
            /* @__PURE__ */ jsx("li", { children: "✓ Funciona para cualquier festival, incluso rurales" }),
            /* @__PURE__ */ jsx("li", { children: "✓ Desde 3 € (ciudad cercana) hasta 20 € (500+ km)" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Necesitas registrarte y acordar con el conductor" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3", children: [
            "Precio medio: ",
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "8–15 €/asiento" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-5 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Bus, { size: 18, className: "text-cr-text-muted" }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg uppercase", children: "Autobús de festival" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] text-cr-text-muted italic", children: "Autocares organizados por operadoras privadas" }),
          /* @__PURE__ */ jsxs("ul", { className: "font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed", children: [
            /* @__PURE__ */ jsx("li", { children: "✓ Salida garantizada desde tu ciudad" }),
            /* @__PURE__ */ jsx("li", { children: "✓ Cómodo para no conducir" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Solo desde ciudades concretas (Madrid, BCN, Bilbao…)" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Horario de vuelta fijo (aunque el último bolo no haya acabado)" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Se agota semanas antes del festival" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Precio más alto que carpooling" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3", children: [
            "Precio medio: ",
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "15–35 €/asiento" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-5 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(TramFront, { size: 18, className: "text-cr-text-muted" }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg uppercase", children: "Transporte público" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] text-cr-text-muted italic", children: "Metro, Cercanías, EMT, lanzaderas gratuitas" }),
          /* @__PURE__ */ jsxs("ul", { className: "font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed", children: [
            /* @__PURE__ */ jsx("li", { children: "✓ Barato o gratuito (lanzaderas)" }),
            /* @__PURE__ */ jsx("li", { children: "✓ Ideal para recintos bien comunicados (Fòrum BCN, Fira Montjuïc)" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Metro cierra a la 1:30 (Madrid), 2:00 (Barcelona)" }),
            /* @__PURE__ */ jsx("li", { children: "✗ No llega a festivales rurales (Viveiro, Burriana, Villarrobledo)" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Masificación extrema a la salida" }),
            /* @__PURE__ */ jsx("li", { children: "✗ No existe de vuelta en la madrugada" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3", children: [
            "Precio medio: ",
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "0–5 € (si existe)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-5 space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Zap, { size: 18, className: "text-cr-text-muted" }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-lg uppercase", children: "Taxi / VTC" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] text-cr-text-muted italic", children: "Plataformas VTC y taxi convencional" }),
          /* @__PURE__ */ jsxs("ul", { className: "font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed", children: [
            /* @__PURE__ */ jsx("li", { children: "✓ Disponible a cualquier hora" }),
            /* @__PURE__ */ jsx("li", { children: "✓ Puerta a puerta" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Precio x2–x3 en noches de festival" }),
            /* @__PURE__ */ jsx("li", { children: "✗ 30–90 € de media para la vuelta de madrugada" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Largas esperas a la salida del festival" }),
            /* @__PURE__ */ jsx("li", { children: "✗ Zonas de recogida congestionadas" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3", children: [
            "Precio medio vuelta de madrugada: ",
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "40–90 €" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl md:text-4xl uppercase", children: "El problema de volver de noche" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl", children: "La mayoría de los festivales y conciertos terminan entre la 1:00 y las 4:00 de la mañana. En ese momento:" }),
      /* @__PURE__ */ jsxs("ul", { className: "font-sans text-sm text-cr-text-muted space-y-2 leading-relaxed list-none", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-cr-secondary font-bold shrink-0", children: "·" }),
          "El metro de Madrid cierra a la 1:30 (ampliado a las 2:00–2:30 en noches de festival)."
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-cr-secondary font-bold shrink-0", children: "·" }),
          "Los autobuses nocturnos (búhos en Madrid, nitbus en Barcelona) no llegan a los recintos de festival."
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-cr-secondary font-bold shrink-0", children: "·" }),
          "Taxis y VTC multiplican por 2–3 el precio en horario de madrugada con alta demanda."
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-cr-secondary font-bold shrink-0", children: "·" }),
          "Los buses de festival tienen horario de vuelta fijo que no siempre coincide con el final del festival."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 border border-cr-primary/30 bg-cr-primary/5 space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-base uppercase text-cr-primary", children: "La solución: carpooling de vuelta pactado" }),
        /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: [
          "Con ConcertRide, acuerdas con el conductor ",
          /* @__PURE__ */ jsx("em", { children: "antes del festival" }),
          " a qué hora volváis. «Salimos cuando acabe el último bolo, sobre las 2:30» es la instrucción más habitual. El conductor espera en el punto acordado y os lleváis a casa. Precio de vuelta: igual que la ida."
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/concerts",
          className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
          children: [
            "Buscar viaje de vuelta ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl md:text-4xl uppercase", children: "Festivales y sostenibilidad: el transporte importa" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl", children: "El 80% de la huella de carbono de un festival de música proviene del transporte de los asistentes, no del escenario ni la producción. Cada coche que lleva 4 personas al festival en lugar de ir solo elimina 3 vehículos de la carretera y reduce las emisiones por persona un 75%." }),
      /* @__PURE__ */ jsxs("blockquote", { className: "border-l-2 border-cr-primary pl-5 space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted italic leading-relaxed", children: '"El transporte de los asistentes supone el 80 % de la huella de carbono de un festival de música. El carpooling es la acción individual más efectiva para reducirla."' }),
        /* @__PURE__ */ jsxs("footer", { className: "font-mono text-[11px] text-cr-text-dim", children: [
          "— ",
          /* @__PURE__ */ jsx("a", { href: "https://juliesbicycle.com/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-cr-primary", children: "Julie's Bicycle Practical Guide to Green Events" }),
          ", referencia del sector para festivales sostenibles en Europa"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "border border-cr-border p-4 text-center space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-3xl uppercase text-cr-primary", children: "75%" }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted", children: "menos CO₂ por pasajero vs ir solo en coche" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border border-cr-border p-4 text-center space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-3xl uppercase text-cr-primary", children: "80%" }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted", children: "de la huella de un festival viene del transporte" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border border-cr-border p-4 text-center space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-display text-3xl uppercase text-cr-primary", children: "0 €" }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted", children: "de comisión para conductores y pasajeros" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl", children: "ConcertRide no es solo más barato que el taxi — es la forma más sostenible de llegar a un festival si ya vas a ir en coche. Sin aplicación de empresa, sin flotas de vehículos adicionales: aprovecha los asientos vacíos de coches que ya iban a hacer el trayecto." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl md:text-4xl uppercase", children: "Cómo llegar a cada festival" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted max-w-2xl", children: "Páginas específicas con precios por ciudad, FAQ de transporte y viajes disponibles en tiempo real." }),
      /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: FESTIVAL_LANDINGS.map((f) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/festivales/${f.slug}`,
          className: "flex items-center justify-between font-sans text-sm text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-4 py-3 transition-colors group",
          children: [
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: f.shortName }),
              /* @__PURE__ */ jsxs("span", { className: "text-cr-text-muted", children: [
                " — ",
                f.city
              ] })
            ] }),
            /* @__PURE__ */ jsx(ArrowRight, { size: 12, className: "opacity-0 group-hover:opacity-100 transition-opacity text-cr-primary" })
          ]
        }
      ) }, f.slug)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl md:text-4xl uppercase", children: "Preguntas frecuentes sobre transporte a festivales" }),
      /* @__PURE__ */ jsx("dl", { className: "space-y-6", children: GUIDE_FAQS.map((faq) => /* @__PURE__ */ jsxs("div", { className: "border-b border-cr-border pb-6 space-y-2", children: [
        /* @__PURE__ */ jsx("dt", { className: "font-display text-base uppercase text-cr-text", children: faq.q }),
        /* @__PURE__ */ jsx("dd", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl", children: faq.a })
      ] }, faq.q)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl uppercase", children: "¿Listo para ir al festival?" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted max-w-xl", children: "Busca tu concierto, encuentra un viaje compartido desde tu ciudad y llega (y vuelve) sin pagar de más." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/concerts",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors",
            children: [
              "Buscar viaje ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/publish",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors",
            children: [
              "Publicar un viaje ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/faq",
            className: "inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
            children: [
              "Ver todas las FAQs ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        )
      ] })
    ] })
  ] });
}
const BLOG_POSTS = [
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "como-volver-festival-madrugada",
    title: "Cómo volver de un festival de madrugada (sin taxi a 90 €)",
    h1: "Cómo volver de un festival de madrugada en España",
    excerpt: "El último metro sale a las 1:30 y el festival acaba a las 2:30. Aquí tienes las opciones reales para volver: carpooling, lanzaderas oficiales, autobús nocturno o taxi compartido. Precios, ventajas y trampas.",
    category: "guias",
    tags: ["transporte", "festivales", "vuelta", "madrugada"],
    publishedAt: "2026-04-25T09:30:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 6,
    lede: "El 80 % de los problemas de un festival no son la cola de los baños — son volver a casa. Si te has visto a las 3 am con el móvil al 5 % buscando un taxi, esta guía es para ti.",
    sections: [
      {
        heading: "Las 4 opciones reales (y cuándo usar cada una)",
        paragraphs: [
          'Para la mayoría de festivales españoles, las opciones realistas para volver entre la 1 y las 5 am son: carpooling, lanzadera oficial del festival, autobús urbano nocturno ("búho") y taxi/VTC. El tren rara vez funciona a esas horas.'
        ],
        bullets: [
          "Carpooling: 5–25 €. Sin esperas si reservas antes. Sale del recinto.",
          "Lanzadera oficial: 5–15 €. Sale solo de un par de hubs urbanos. Puede tener 30–60 min de cola.",
          "Búho urbano: 1,50–3 €. Solo dentro del área metropolitana del recinto. No conecta con otras ciudades.",
          "Taxi/VTC: 30–90 € en madrugada (festival = tarifa nocturna + recargo de evento). Casi imposible encontrar uno entre las 2 y las 4 am."
        ]
      },
      {
        heading: "Por qué el carpooling es la opción más estable",
        paragraphs: [
          "El carpooling tiene una ventaja invisible: la plaza está reservada antes del festival. No dependes de que aparezca un taxi ni de hacer cola con otros 200 sudados a las 3 am.",
          "El conductor también va al festival, así que el horario de salida está alineado con el final real del show — no con un horario teórico de bus que sale a las 23:30 y te obliga a perderte el cabeza de cartel.",
          "En ConcertRide la mayoría de viajes incluyen vuelta. Cuando publicas el viaje de ida, el conductor suele añadir el de regreso al recinto (con punto de encuentro fijo y hora aproximada)."
        ]
      },
      {
        heading: "Trampas a evitar",
        paragraphs: [
          "No te fíes del “Uber/Cabify llega en 5 min” a las 2:30 am en un festival: la app puede mostrarte un coche, pero la cola virtual oculta tiempos reales de 45–90 min en eventos masivos. La oferta cae a cero.",
          "Cuidado también con el “taxi pirata” en la salida del recinto: ofrecen tarifas planas a 100 € y muchas veces no son legales. Si vas a coger taxi, hazlo desde una parada oficial dentro del recinto o llamando a la central."
        ]
      },
      {
        heading: "Checklist antes del festival",
        paragraphs: [
          "Si todavía no has resuelto la vuelta y faltan menos de 48 h, sigue estos pasos:"
        ],
        bullets: [
          "1. Busca tu festival en concertride.me y filtra por “con regreso incluido”.",
          "2. Si no encuentras, busca lanzadera oficial del festival o autobús nocturno.",
          "3. Si tampoco, reserva la lanzadera oficial del festival (siempre cobran solo a la salida).",
          "4. Como último recurso, comparte taxi entre 4: divide el coste, evita el caos."
        ]
      }
    ],
    faqs: [
      {
        q: "¿Hay metro o tren la noche de un festival grande?",
        a: "Casi nunca. Mad Cool, Primavera Sound, Sónar y BBK Live acaban después de la última conexión de transporte público. La excepción es Sónar de Día, que sí cierra dentro del horario del metro de Barcelona."
      },
      {
        q: "¿Cuánto cuesta un taxi del festival a Madrid centro de madrugada?",
        a: "Entre 30 € (Mad Cool → Sol) y 90 € (Mad Cool → Tres Cantos), con tarifa nocturna y recargo de evento. Si lo compartes con 3 más, el coste por persona se acerca al de un carpooling."
      },
      {
        q: "¿Qué pasa si el conductor del carpooling se va antes de que termine el show?",
        a: "El acuerdo es claro antes de viajar: el conductor publica una hora estimada de salida (suele ser entre 30 min y 1 h después de que acabe el cabeza de cartel). Si necesitas quedarte hasta el último DJ, busca un viaje con horario más tardío."
      }
    ],
    relatedLinks: [
      { label: "Guía de transporte para festivales en España", to: "/guia-transporte-festivales" },
      { label: "Carpooling a Mad Cool", to: "/festivales/mad-cool" }
    ],
    relatedPosts: ["huella-carbono-festivales-carpooling"]
  },
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "huella-carbono-festivales-carpooling",
    title: "Huella de carbono de un festival: por qué el carpooling es la acción más efectiva",
    h1: "Huella de carbono y festivales: lo que el carpooling cambia de verdad",
    excerpt: "El 80 % de las emisiones de un festival vienen del transporte de los asistentes. Compartir coche reduce esas emisiones hasta un 75 % por persona. Datos, fuentes y cálculo paso a paso.",
    category: "sostenibilidad",
    tags: ["sostenibilidad", "huella de carbono", "festivales", "carpooling"],
    publishedAt: "2026-04-25T10:00:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 8,
    lede: "Si te preocupa el impacto ambiental de ir a un festival, hay una decisión que pesa más que reciclar el vaso de plástico o llevar fiambrera. La forma de llegar al recinto es el factor número uno.",
    sections: [
      {
        heading: "El reparto real de las emisiones de un festival",
        paragraphs: [
          "Según Julie's Bicycle (referencia del sector en eventos sostenibles), entre el 70 % y el 85 % de la huella de carbono de un festival proviene del transporte de los asistentes. La energía del recinto, la comida y los residuos suman el resto.",
          "Esto significa que las medidas sostenibles más visibles (bombillas LED, vasos retornables, papeleras de reciclaje) tienen un impacto marginal comparado con cómo llegan los 50.000 asistentes al recinto."
        ]
      },
      {
        heading: "Cuánto reduce el carpooling: el cálculo",
        paragraphs: [
          "Un coche compartido entre 4 personas reduce las emisiones por pasajero en un 75 % comparado con 4 coches con un solo ocupante. Es matemática simple: el combustible se reparte.",
          "Un Madrid → Mad Cool (75 km ida y vuelta) emite unos 12 kg de CO₂ con un coche medio. En solitario, son 12 kg por persona; compartido entre 4, son 3 kg por persona.",
          "Para un festival de 50.000 personas con un 30 % de asistentes en coche solo, mover ese tercio a carpooling de 4 ahorraría unas 110 toneladas de CO₂ por evento. El equivalente a 50 vuelos Madrid–Barcelona."
        ]
      },
      {
        heading: "Por qué el coche compartido le gana al transporte público en festivales",
        paragraphs: [
          "El transporte público parece la opción ecológica obvia, pero en festivales suele perder la pelea por dos razones:"
        ],
        bullets: [
          "Cobertura: la mayoría de recintos están fuera de la red de cercanías o metro. Un autobús lanzadera puntual emite menos por persona que un coche compartido, pero solo si va lleno.",
          "Hora de vuelta: el último cercanías sale antes de que acabe el festival. Si te obliga a coger taxi para volver, las emisiones se disparan: un taxi vacío de vuelta dobla el impacto."
        ]
      },
      {
        heading: "Cómo medirlo: la calculadora MITECO",
        paragraphs: [
          "Si quieres calcular tu huella exacta, el Ministerio para la Transición Ecológica (MITECO) publica un factor oficial de emisión por km y tipo de vehículo. Para un coche diésel medio: 158 g CO₂/km. Para gasolina: 145 g/km.",
          "Con esos datos, una calculadora rápida es: (km del viaje × factor) ÷ ocupantes. Es el mismo cálculo que usamos en ConcertRide para mostrar el ahorro al pasajero al confirmar la reserva."
        ]
      },
      {
        heading: "Más allá del CO₂: el ruido y el tráfico local",
        paragraphs: [
          "Reducir coches en el acceso al festival también beneficia a los vecinos del recinto. Mad Cool en Villaverde, Primavera Sound en Parc del Fòrum y Sónar en Fira son zonas residenciales: cada coche menos en las salidas reduce ruido nocturno y atascos.",
          "Algunos festivales han empezado a premiar a los grupos que llegan en coche compartido (descuentos en consumiciones, entrada anticipada al recinto). Pregunta al festival si lo ofrecen."
        ]
      }
    ],
    faqs: [
      {
        q: "¿Coche eléctrico o coche compartido: qué emite menos?",
        a: "Para una distancia típica de festival (50–200 km), un coche compartido de 4 personas con un coche de combustión medio emite menos por persona que un eléctrico con un solo ocupante. La ocupación pesa más que el tipo de motor."
      },
      {
        q: "¿El tren no es lo más sostenible?",
        a: "Sí, cuando existe y llega al recinto. El problema es la última milla y el horario nocturno. Si el tren llega al recinto y tienes vuelta antes de que acabe el festival, gana al carpooling. Si no, el coche compartido suele ser mejor que el tren + taxi."
      },
      {
        q: "¿Hay alguna fuente oficial de estos datos?",
        a: "Sí. Julie's Bicycle (juliesbicycle.com) publica guías específicas para festivales. La Asociación de Promotores Musicales (APM) y MITECO publican datos para España. El factor oficial de emisión por km de coche está en la Guía MITECO de huella de carbono."
      }
    ],
    relatedLinks: [
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" }
    ],
    relatedPosts: ["como-volver-festival-madrugada"]
  }
];
const BLOG_POSTS_BY_SLUG = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p])
);
const BLOG_SLUGS$1 = BLOG_POSTS.map((p) => p.slug);
const BLOG_CATEGORIES = [
  { slug: "comparativas", label: "Comparativas" },
  { slug: "guias", label: "Guías" },
  { slug: "sostenibilidad", label: "Sostenibilidad" },
  { slug: "novedades", label: "Novedades" }
];
function BlogIndexPage() {
  useSeoMeta({
    title: "Blog ConcertRide — Carpooling, festivales y sostenibilidad",
    description: "Comparativas, guías de transporte y sostenibilidad para asistentes a festivales en España. Aprende a moverte mejor, gastar menos y reducir tu huella.",
    canonical: `${SITE_URL}/blog`,
    keywords: "blog carpooling, guía festivales España, transporte concierto, huella carbono festival, carpooling conciertos"
  });
  const sorted = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog ConcertRide",
    url: `${SITE_URL}/blog`,
    inLanguage: "es-ES",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: sorted.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt ?? p.publishedAt,
      author: { "@type": "Organization", name: p.author },
      description: p.excerpt,
      articleSection: p.category
    }))
  };
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` }
    ]
  };
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdItemList) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdBreadcrumb) } }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: "Blog" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Blog" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        "Carpooling,",
        /* @__PURE__ */ jsx("br", {}),
        "festivales,",
        /* @__PURE__ */ jsx("br", {}),
        "sostenibilidad."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: "Comparativas honestas, guías prácticas y datos reales para que ir a un festival en España sea más barato, más sostenible y menos estresante." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: [
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-2 mb-10", children: BLOG_CATEGORIES.map((cat) => {
        const count = BLOG_POSTS.filter((p) => p.category === cat.slug).length;
        if (count === 0) return null;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5", children: [
          cat.label,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-cr-primary", children: count })
        ] }) }, cat.slug);
      }) }),
      /* @__PURE__ */ jsx("ol", { className: "space-y-8", children: sorted.map((post) => {
        var _a2;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-6 hover:border-cr-primary/50 transition-colors group", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4 font-mono text-[11px] text-cr-text-muted", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary uppercase tracking-[0.12em]", children: ((_a2 = BLOG_CATEGORIES.find((c) => c.slug === post.category)) == null ? void 0 : _a2.label) ?? post.category }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "·" }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 11 }),
              new Date(post.publishedAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })
            ] }),
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "·" }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { size: 11 }),
              post.readingMinutes,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase leading-tight mb-3", children: /* @__PURE__ */ jsx(Link, { to: `/blog/${post.slug}`, className: "hover:text-cr-primary transition-colors", children: post.title }) }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl mb-5", children: post.excerpt }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/blog/${post.slug}`,
              className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors",
              children: [
                "Leer artículo ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
              ]
            }
          )
        ] }) }, post.slug);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted mb-4", children: "Explora también" }),
      /* @__PURE__ */ jsxs("ul", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/festivales",
            className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
            children: "Festivales 2026"
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/guia-transporte-festivales",
            className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
            children: "Guía de transporte"
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/como-funciona",
            className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
            children: "Cómo funciona"
          }
        ) })
      ] })
    ] })
  ] });
}
function BlogPostPage() {
  var _a2, _b;
  const { slug } = useParams();
  const post = slug ? BLOG_POSTS_BY_SLUG[slug] : void 0;
  useSeoMeta({
    title: (post == null ? void 0 : post.title) ?? "Artículo no encontrado",
    description: post == null ? void 0 : post.excerpt,
    canonical: post ? `${SITE_URL}/blog/${post.slug}` : `${SITE_URL}/blog`,
    keywords: post == null ? void 0 : post.tags.join(", "),
    ogType: "article",
    articleAuthor: post == null ? void 0 : post.author,
    articlePublishedTime: post == null ? void 0 : post.publishedAt,
    articleModifiedTime: (post == null ? void 0 : post.updatedAt) ?? (post == null ? void 0 : post.publishedAt),
    articleSection: post ? (_a2 = BLOG_CATEGORIES.find((c) => c.slug === post.category)) == null ? void 0 : _a2.label : void 0,
    noindex: !post
  });
  useEffect(() => {
    if (post) trackBlogView(post.slug, post.title);
  }, [post]);
  if (!slug || !post) return /* @__PURE__ */ jsx(Navigate, { to: "/blog", replace: true });
  const categoryLabel = ((_b = BLOG_CATEGORIES.find((c) => c.slug === post.category)) == null ? void 0 : _b.label) ?? post.category;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    name: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "es-ES",
    articleSection: categoryLabel,
    keywords: post.tags.join(", "),
    wordCount: post.sections.reduce((acc, s) => acc + s.paragraphs.join(" ").split(/\s+/).length, 0),
    author: {
      "@type": "Organization",
      name: post.author,
      url: `${SITE_URL}/`
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630
    }
  };
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url }
    ]
  };
  const jsonLdFaq = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  } : null;
  const related = (post.relatedPosts ?? []).map((s) => BLOG_POSTS_BY_SLUG[s]).filter((p) => Boolean(p));
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdArticle) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdBreadcrumb) } }),
    jsonLdFaq && /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdFaq) } }),
    /* @__PURE__ */ jsxs("header", { className: "max-w-3xl mx-auto px-6 pt-10 pb-6 space-y-5", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: "/blog", className: "hover:text-cr-primary", children: "Blog" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted truncate", children: post.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 font-mono text-[11px] text-cr-text-muted", children: [
        /* @__PURE__ */ jsx("span", { className: "text-cr-primary uppercase tracking-[0.12em]", children: categoryLabel }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "·" }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 11 }),
          new Date(post.publishedAt).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })
        ] }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "·" }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Clock, { size: 11 }),
          post.readingMinutes,
          " min"
        ] }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "·" }),
        /* @__PURE__ */ jsx("span", { children: post.author })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl md:text-5xl uppercase leading-[0.96]", children: post.h1 }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-base md:text-lg text-cr-text leading-relaxed", children: post.lede })
    ] }),
    /* @__PURE__ */ jsxs("article", { className: "max-w-3xl mx-auto px-6 pb-16 border-t border-cr-border pt-10 space-y-12", children: [
      post.sections.map((section) => /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: section.heading }),
        section.paragraphs.map((p, i) => /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted leading-relaxed", children: p }, i)),
        section.bullets && section.bullets.length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-2 pt-2", children: section.bullets.map((b, i) => /* @__PURE__ */ jsx(
          "li",
          {
            className: "font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary",
            children: b
          },
          i
        )) })
      ] }, section.heading)),
      post.faqs && post.faqs.length > 0 && /* @__PURE__ */ jsxs("section", { className: "space-y-6 border-t border-cr-border pt-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Preguntas frecuentes" }),
        /* @__PURE__ */ jsx("dl", { className: "space-y-6", children: post.faqs.map((f) => /* @__PURE__ */ jsxs("div", { className: "border-b border-cr-border pb-6 space-y-2", children: [
          /* @__PURE__ */ jsx("dt", { className: "font-display text-base uppercase text-cr-text", children: f.q }),
          /* @__PURE__ */ jsx("dd", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: f.a })
        ] }, f.q)) })
      ] }),
      post.relatedLinks && post.relatedLinks.length > 0 && /* @__PURE__ */ jsxs("section", { className: "border-t border-cr-border pt-10 space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted", children: "Sigue leyendo" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: post.relatedLinks.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: l.to,
            className: "inline-flex items-center gap-2 font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors",
            children: [
              l.label,
              " ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ) }, l.to)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "border border-cr-primary/40 bg-cr-primary/5 p-6 space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase", children: "¿Vas a un festival este verano?" }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: "Encuentra tu viaje compartido o publica el tuyo. Sin comisiones, pago al conductor en efectivo o Bizum. Conductores verificados." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/concerts",
              className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
              children: [
                "Buscar viaje ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/publish",
              className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors",
              children: [
                "Publicar viaje ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
              ]
            }
          )
        ] })
      ] }),
      related.length > 0 && /* @__PURE__ */ jsxs("section", { className: "border-t border-cr-border pt-10 space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted", children: "Más artículos" }),
        /* @__PURE__ */ jsx("ul", { className: "grid sm:grid-cols-2 gap-4", children: related.map((r) => {
          var _a3;
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: `/blog/${r.slug}`,
              className: "block border border-cr-border p-4 hover:border-cr-primary/50 transition-colors space-y-2",
              children: [
                /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-cr-primary uppercase tracking-[0.12em]", children: (_a3 = BLOG_CATEGORIES.find((c) => c.slug === r.category)) == null ? void 0 : _a3.label }),
                /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase leading-tight", children: r.title }),
                /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed line-clamp-3", children: r.excerpt })
              ]
            }
          ) }, r.slug);
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/blog",
          className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 12 }),
            " Volver al blog"
          ]
        }
      ) })
    ] })
  ] });
}
function cityToSlug(city) {
  return city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function buildRoutes() {
  const routes = [];
  for (const festival of FESTIVAL_LANDINGS) {
    for (const oc of festival.originCities) {
      const originSlug = cityToSlug(oc.city);
      routes.push({
        slug: `${originSlug}-${festival.slug}`,
        originCity: oc.city,
        originCitySlug: originSlug,
        festival,
        originData: oc
      });
    }
  }
  return routes;
}
const ROUTE_LANDINGS = buildRoutes();
const ROUTE_LANDINGS_BY_SLUG = Object.fromEntries(
  ROUTE_LANDINGS.map((r) => [r.slug, r])
);
const ROUTE_SLUGS$1 = ROUTE_LANDINGS.map((r) => r.slug);
function RouteLandingPage() {
  const { route: slug } = useParams();
  const landing = slug ? ROUTE_LANDINGS_BY_SLUG[slug] : void 0;
  const [concerts, setConcerts] = useState(null);
  useSeoMeta({
    title: landing ? `Carpooling ${landing.originCity} a ${landing.festival.shortName} — ${landing.originData.concertRideRange} · ${landing.originData.drivingTime}` : "Ruta de carpooling",
    description: landing ? `Viaje compartido de ${landing.originCity} a ${landing.festival.name} (${landing.festival.city}). ${landing.originData.km} km · ${landing.originData.drivingTime} · desde ${landing.originData.concertRideRange}/asiento. Sin comisión, sin taxi, conductores verificados.` : "Carpooling a festivales en España.",
    canonical: landing ? `${SITE_URL}/rutas/${landing.slug}` : `${SITE_URL}/concerts`,
    keywords: landing ? `carpooling ${landing.originCity} ${landing.festival.shortName}, coche compartido ${landing.originCity} ${landing.festival.shortName}, viaje compartido ${landing.originCity} ${landing.festival.shortName}, como ir ${landing.festival.shortName} desde ${landing.originCity}, cómo ir ${landing.festival.shortName} desde ${landing.originCity}, transporte ${landing.originCity} ${landing.festival.shortName}, bus ${landing.originCity} ${landing.festival.shortName}` : void 0
  });
  useEffect(() => {
    if (!landing) return;
    setConcerts(null);
    api.concerts.list({ city: landing.festival.city, date_from: (/* @__PURE__ */ new Date()).toISOString(), limit: 6 }).then((r) => {
      setConcerts(r.concerts);
      trackRouteSearch(landing.originCity, landing.festival.city);
    }).catch(() => setConcerts([]));
  }, [landing]);
  if (!slug || !landing) return /* @__PURE__ */ jsx(Navigate, { to: "/concerts", replace: true });
  const { festival, originData, originCity } = landing;
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${SITE_URL}/rutas` },
      { "@type": "ListItem", position: 3, name: `${originCity} → ${festival.shortName}`, item: `${SITE_URL}/rutas/${landing.slug}` }
    ]
  };
  const jsonLdTrip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Carpooling de ${originCity} a ${festival.name}`,
    description: `Viaje compartido de ${originCity} a ${festival.name}. ${originData.km} km, ${originData.drivingTime}, desde ${originData.concertRideRange}.`,
    url: `${SITE_URL}/rutas/${landing.slug}`,
    touristType: "Aficionados a la música",
    itinerary: [
      {
        "@type": "Place",
        name: originCity,
        address: { "@type": "PostalAddress", addressLocality: originCity, addressCountry: "ES" }
      },
      {
        "@type": "Place",
        name: festival.venue,
        address: {
          "@type": "PostalAddress",
          streetAddress: festival.venueAddress,
          addressLocality: festival.city,
          addressRegion: festival.region,
          addressCountry: "ES"
        },
        geo: { "@type": "GeoCoordinates", latitude: festival.lat, longitude: festival.lng }
      }
    ],
    offers: {
      "@type": "Offer",
      price: (originData.concertRideRange.split("–")[0] ?? "3").replace(/[^0-9]/g, "") || "3",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: (/* @__PURE__ */ new Date()).toISOString(),
      url: `${SITE_URL}/rutas/${landing.slug}`
    }
  };
  const futureConcerts = (concerts ?? []).filter(
    (c) => new Date(c.date).getTime() > Date.now()
  );
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdBreadcrumb) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdTrip) } }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: `/festivales/${festival.slug}`, className: "hover:text-cr-primary", children: festival.shortName }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsxs("span", { className: "text-cr-text-muted", children: [
          "Desde ",
          originCity
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Carpooling · Ruta" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        originCity,
        /* @__PURE__ */ jsx("br", {}),
        "→ ",
        festival.shortName,
        "."
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: [
        "Viaje compartido de ",
        originCity,
        " a ",
        festival.name,
        " (",
        festival.city,
        "). Comparte coche, divide gastos y llega al festival sin taxi ni comisiones."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 11 }),
          " ",
          originData.km,
          " km"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5", children: [
          /* @__PURE__ */ jsx(Clock, { size: 11 }),
          " ",
          originData.drivingTime
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-primary border border-cr-primary/30 px-3 py-1.5", children: [
          /* @__PURE__ */ jsx(Euro, { size: 11 }),
          " ",
          originData.concertRideRange
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5", children: [
          /* @__PURE__ */ jsx(Calendar, { size: 11 }),
          " ",
          festival.typicalDates
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Detalles de la ruta" }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Origen" }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted", children: originCity })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Destino" }),
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
            festival.venue,
            ", ",
            festival.city
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Precio estimado" }),
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
            originData.concertRideRange,
            " por asiento. Sin comisión — el 100 % va al conductor."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Distancia" }),
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
            originData.km,
            " km por carretera"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Tiempo" }),
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
            originData.drivingTime,
            " de conducción estimada"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border p-4 space-y-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-base uppercase text-cr-primary", children: "Festival" }),
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
            festival.typicalDates,
            " · ",
            festival.capacity
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-4", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/concerts",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
            children: [
              "Buscar viaje ",
              originCity,
              " → ",
              festival.shortName,
              " ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/publish",
            className: "inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors",
            children: [
              "Publicar viaje ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-2xl md:text-3xl uppercase mb-2", children: [
        "Conciertos en ",
        festival.city
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted mb-8 max-w-xl", children: [
        "Eventos próximos en ",
        festival.city,
        " con viajes desde ",
        originCity,
        "."
      ] }),
      concerts === null ? /* @__PURE__ */ jsx(LoadingSpinner, { text: `Cargando viajes hacia ${festival.shortName}…` }) : futureConcerts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "border border-dashed border-cr-border p-10 text-center space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase text-cr-text-muted", children: "Sin viajes publicados aún" }),
        /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted", children: [
          "Sé el primero en publicar un viaje de ",
          originCity,
          " a ",
          festival.shortName,
          "."
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/publish",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors",
            children: "Publicar viaje →"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: futureConcerts.map((c) => /* @__PURE__ */ jsx(Link, { to: `/concerts/${c.id}`, className: "block", children: /* @__PURE__ */ jsx(ConcertCard, { concert: c }) }, c.id)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12", children: /* @__PURE__ */ jsx(FestivalAlertWidget, { festivalSlug: festival.slug, festivalName: festival.shortName }) }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Preguntas frecuentes" }),
      /* @__PURE__ */ jsx("dl", { className: "space-y-6", children: [
        {
          q: `¿Cuánto cuesta el carpooling de ${originCity} a ${festival.shortName}?`,
          a: `El precio por asiento de ${originCity} a ${festival.shortName} está entre ${originData.concertRideRange}. El conductor fija el precio para cubrir combustible y peajes. Sin comisión: lo que ves es lo que pagas, en efectivo o Bizum el día del viaje.`
        },
        {
          q: `¿Cuánto se tarda en coche de ${originCity} a ${festival.shortName}?`,
          a: `La distancia es de ${originData.km} km. El tiempo estimado de conducción es de ${originData.drivingTime} sin paradas. Con pausa de servicio y tráfico en la entrada al recinto, cuenta aproximadamente 30 min extra.`
        },
        {
          q: `¿Hay carpooling de vuelta desde ${festival.shortName} a ${originCity}?`,
          a: `Sí. La mayoría de conductores publican el viaje de ida y vuelta. Busca en ConcertRide filtrando por "${festival.city}" y verás los viajes con hora de salida del festival.`
        },
        {
          q: `¿Es seguro el carpooling a ${festival.shortName} con ConcertRide?`,
          a: `Todos los conductores verifican su carnet de conducir antes de publicar. Puedes ver su perfil completo, valoraciones de otros pasajeros y el chat del evento. El pago siempre es en persona — nunca adelantas dinero.`
        }
      ].map((faq) => /* @__PURE__ */ jsxs("div", { className: "border-b border-cr-border pb-6 space-y-2", children: [
        /* @__PURE__ */ jsx("dt", { className: "font-display text-base uppercase text-cr-text", children: faq.q }),
        /* @__PURE__ */ jsx("dd", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl", children: faq.a })
      ] }, faq.q)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10 space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted", children: "Más información" }),
      /* @__PURE__ */ jsxs("ul", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/festivales/${festival.slug}`,
            className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
            children: [
              "Carpooling a ",
              festival.shortName,
              " — todas las ciudades"
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/conciertos/${festival.citySlug}`,
            className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
            children: [
              "Conciertos en ",
              festival.city
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/guia-transporte-festivales",
            className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
            children: "Guía de transporte para festivales"
          }
        ) })
      ] })
    ] })
  ] });
}
const ALL_FESTIVALS = [{ slug: "", shortName: "Todos" }, ...FESTIVAL_LANDINGS.map((f) => ({ slug: f.slug, shortName: f.shortName }))];
function RutasIndexPage() {
  useSeoMeta({
    title: "Rutas de carpooling a festivales en España 2026",
    description: "93 rutas de viaje compartido a festivales de música en España. Carpooling Madrid–Mad Cool, Barcelona–Primavera Sound, Valencia–FIB y más. Sin comisión, conductores verificados.",
    canonical: `${SITE_URL}/rutas`,
    keywords: "rutas carpooling festivales, viaje compartido festival, madrid mad cool carpooling, barcelona primavera sound viaje compartido, valencia fib transporte, carpooling festivales españa 2026"
  });
  const [activeFilter, setActiveFilter] = useState("");
  const filtered = useMemo(
    () => activeFilter ? ROUTE_LANDINGS.filter((r) => r.festival.slug === activeFilter) : ROUTE_LANDINGS,
    [activeFilter]
  );
  const grouped = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const r of filtered) {
      const key = r.festival.slug;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return map;
  }, [filtered]);
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${SITE_URL}/rutas` }
    ]
  };
  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rutas de carpooling a festivales en España 2026",
    url: `${SITE_URL}/rutas`,
    numberOfItems: ROUTE_LANDINGS.length,
    itemListElement: ROUTE_LANDINGS.slice(0, 50).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Carpooling ${r.originCity} → ${r.festival.shortName}`,
      url: `${SITE_URL}/rutas/${r.slug}`
    }))
  };
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdBreadcrumb) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdItemList) } }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: "Rutas" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: [
        ROUTE_LANDINGS.length,
        " rutas disponibles"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        "Rutas de",
        /* @__PURE__ */ jsx("br", {}),
        "carpooling."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: "Viajes compartidos desde todas las ciudades de España a los mejores festivales. Sin comisión, pago en efectivo o Bizum el día del viaje." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/publish",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100",
            children: "Publicar un viaje"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/festivales",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-5 py-2.5 transition-colors",
            children: "Ver festivales"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-cr-border", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-6 py-4 grid grid-cols-3 sm:grid-cols-3 gap-4", children: [
      { value: `${ROUTE_LANDINGS.length}`, label: "Rutas programáticas" },
      { value: `${FESTIVAL_LANDINGS.length}`, label: "Festivales cubiertos" },
      { value: "0 %", label: "Comisión de plataforma" }
    ].map((s) => /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsx("p", { className: "font-display text-xl md:text-2xl uppercase text-cr-primary", children: s.value }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-cr-text-muted", children: s.label })
    ] }, s.label)) }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-cr-border", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-2", children: ALL_FESTIVALS.map((f) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveFilter(f.slug),
        className: `font-sans text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors ${activeFilter === f.slug ? "border-cr-primary bg-cr-primary text-black" : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"}`,
        children: f.shortName
      },
      f.slug
    )) }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-6 pb-24 space-y-12 pt-10", children: Array.from(grouped.entries()).map(([festSlug, routes]) => {
      const festival = routes[0].festival;
      return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3 border-t border-cr-border pt-6", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: `/festivales/${festival.slug}`,
              className: "font-display text-xl md:text-2xl uppercase hover:text-cr-primary transition-colors",
              children: festival.name
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "font-mono text-[11px] text-cr-text-muted", children: [
            festival.city,
            " · ",
            festival.startDate.slice(0, 7).split("-").reverse().join("/")
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: routes.map((r) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/rutas/${r.slug}`,
            className: "group border border-cr-border p-4 flex items-start justify-between gap-3 hover:border-cr-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted", children: [
                  /* @__PURE__ */ jsx(MapPin, { size: 10 }),
                  /* @__PURE__ */ jsx("span", { className: "truncate", children: r.originCity })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "font-sans text-xs text-cr-text group-hover:text-cr-primary transition-colors truncate", children: [
                  r.originData.km,
                  " km · ",
                  r.originData.drivingTime
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-cr-primary font-semibold", children: r.originData.concertRideRange }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 11, className: "text-cr-text-muted group-hover:text-cr-primary transition-colors" })
              ] })
            ]
          },
          r.slug
        )) })
      ] }, festSlug);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-cr-border", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 py-12 space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "¿No encuentras tu ruta?" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed", children: "Publica tu viaje o busca uno existente desde cualquier ciudad. También puedes activar alertas para recibir aviso cuando salga un viaje a tu festival." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/publish",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100",
            children: "Publicar un viaje"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/concerts",
            className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-5 py-2.5 transition-colors",
            children: "Buscar conciertos"
          }
        )
      ] })
    ] }) })
  ] });
}
const STATS = [
  { label: "Festivales cubiertos", value: "16" },
  { label: "Ciudades con landing page", value: "10" },
  { label: "Rutas programáticas", value: "93" },
  { label: "Cobertura", value: "España" },
  { label: "Comisión de plataforma", value: "0 %" },
  { label: "Fondada", value: "2026" }
];
const KEY_FACTS = [
  "Plataforma española de carpooling exclusiva para conciertos y festivales de música.",
  "El conductor recibe el 100 % del precio del asiento — ConcertRide no cobra comisión.",
  "Pago en persona (efectivo o Bizum) el día del viaje. Sin procesamiento de pagos.",
  "Conductores verificados: carnet de conducir validado antes de publicar el primer viaje.",
  "Modelo legal: compartición de gastos (cost-sharing), reconocido por la DGT. No requiere licencia VTC.",
  "El carpooling reduce la huella de CO₂ por asistente hasta un 75 % frente al coche en solitario (fuente: Julie's Bicycle).",
  "España celebró 1.000+ festivales con 25 millones de asistentes en 2024 (fuente: APM)."
];
const LINKS = [
  { label: "Logo SVG (alta resolución)", href: `${SITE_URL}/favicon.svg`, ext: true },
  { label: "OG Image 1200×630 PNG", href: `${SITE_URL}/og/home.png`, ext: true },
  { label: "llms.txt (datos estructurados para IA)", href: `${SITE_URL}/llms.txt`, ext: true },
  { label: "llms-full.txt (contexto extendido)", href: `${SITE_URL}/llms-full.txt`, ext: true }
];
function PrensaPage() {
  useSeoMeta({
    title: "Prensa y medios — ConcertRide ES",
    description: "Datos clave, cifras, recursos gráficos y contacto para medios. ConcertRide ES es la plataforma española de carpooling para conciertos y festivales de música. Sin comisiones, conductores verificados.",
    canonical: `${SITE_URL}/prensa`,
    keywords: "press kit ConcertRide, medios ConcertRide, datos ConcertRide, carpooling festivales España prensa"
  });
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Prensa", item: `${SITE_URL}/prensa` }
    ]
  };
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "ConcertRide ES",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og/home.png`,
    description: "Plataforma española de carpooling exclusiva para conciertos y festivales. Conecta conductores y pasajeros que van al mismo evento para compartir gastos de desplazamiento. Sin comisiones.",
    foundingDate: "2026",
    areaServed: { "@type": "Country", name: "Spain" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Press",
      email: "alejandrolalaguna@gmail.com"
    }
  };
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdBreadcrumb) } }),
    /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdOrg) } }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "font-mono text-[11px] text-cr-text-muted flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-cr-primary", children: "Inicio" }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsx("span", { className: "text-cr-text-muted", children: "Prensa" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Medios y prensa" }),
      /* @__PURE__ */ jsxs("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: [
        "Press kit",
        /* @__PURE__ */ jsx("br", {}),
        "ConcertRide."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed", children: "Todo lo que necesitas para cubrir ConcertRide: datos clave, cifras verificadas, recursos gráficos y contacto de prensa." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Descripción para medios" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl", children: [
          /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Una línea:" }),
          " ",
          "ConcertRide ES es la plataforma española de carpooling exclusiva para conciertos y festivales de música — sin comisiones, con conductores verificados."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl", children: [
          /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Un párrafo:" }),
          " ",
          "ConcertRide conecta fans que van al mismo concierto o festival para compartir coche y dividir los gastos de combustible y peajes. El conductor recibe el 100 % del precio del asiento; la plataforma no cobra comisión. El pago se realiza en efectivo o Bizum el día del viaje. Todos los conductores verifican su carnet antes de publicar. Cubre los 16 principales festivales de España y cuenta con landing pages para 10 ciudades y 93 rutas origen→festival."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Cifras clave" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: STATS.map((s) => /* @__PURE__ */ jsxs("div", { className: "border border-cr-border p-4 space-y-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-2xl md:text-3xl uppercase text-cr-primary", children: s.value }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-cr-text-muted", children: s.label })
      ] }, s.label)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Datos verificables" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: KEY_FACTS.map((f) => /* @__PURE__ */ jsx(
        "li",
        {
          className: "font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary",
          children: f
        },
        f
      )) }),
      /* @__PURE__ */ jsxs("p", { className: "font-mono text-[11px] text-cr-text-dim mt-2", children: [
        "Fuentes:",
        " ",
        /* @__PURE__ */ jsx("a", { href: "https://juliesbicycle.com/", target: "_blank", rel: "noopener noreferrer", className: "underline underline-offset-2 hover:text-cr-primary", children: "Julie's Bicycle" }),
        " · ",
        /* @__PURE__ */ jsx("a", { href: "https://www.apmusicales.com/", target: "_blank", rel: "noopener noreferrer", className: "underline underline-offset-2 hover:text-cr-primary", children: "Asociación de Promotores Musicales (APM)" }),
        " · ",
        /* @__PURE__ */ jsx("a", { href: "https://www.miteco.gob.es/", target: "_blank", rel: "noopener noreferrer", className: "underline underline-offset-2 hover:text-cr-primary", children: "MITECO" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Recursos gráficos" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: LINKS.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: l.href,
          target: l.ext ? "_blank" : void 0,
          rel: l.ext ? "noopener noreferrer" : void 0,
          className: "inline-flex items-center gap-2 font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors",
          children: [
            l.ext ? /* @__PURE__ */ jsx(ExternalLink, { size: 12 }) : /* @__PURE__ */ jsx(Download, { size: 12 }),
            l.label
          ]
        }
      ) }, l.href)) }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-xs text-cr-text-muted leading-relaxed max-w-2xl", children: "El logotipo y los activos gráficos de ConcertRide pueden usarse en contexto editorial (artículos, reseñas, comparativas) sin autorización previa. Para campañas publicitarias o usos comerciales, contacta con nosotros." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Contexto sectorial" }),
      /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        {
          stat: "80 %",
          body: "de la huella de carbono de un festival proviene del transporte de los asistentes.",
          source: "Julie's Bicycle Green Events Guide",
          href: "https://juliesbicycle.com/"
        },
        {
          stat: "25 M",
          body: "de asistentes a festivales y conciertos en España en 2024 (600 M€ de facturación).",
          source: "APM Informe 2024",
          href: "https://www.apmusicales.com/"
        },
        {
          stat: "45–90 min",
          body: "de espera de taxi en la salida de un festival grande en hora pico, según conductores y asistentes.",
          source: "Relatos de usuarios y conductores, 2024–2025",
          href: void 0
        },
        {
          stat: "0 %",
          body: "de comisión cobra ConcertRide. El precio que ves es el precio que pagas, sin intermediarios.",
          source: "Tarifas públicas de cada plataforma, abril 2026",
          href: void 0
        }
      ].map((item) => /* @__PURE__ */ jsxs("div", { className: "border border-cr-border p-4 space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-3xl uppercase text-cr-primary", children: item.stat }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: item.body }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[10px] text-cr-text-dim", children: item.href ? /* @__PURE__ */ jsx("a", { href: item.href, target: "_blank", rel: "noopener noreferrer", className: "underline underline-offset-2 hover:text-cr-primary", children: item.source }) : item.source })
      ] }, item.stat)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase", children: "Contacto de prensa" }),
      /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed max-w-xl", children: "Para entrevistas, datos adicionales, imágenes en alta resolución o colaboraciones editoriales, contacta directamente:" }),
      /* @__PURE__ */ jsxs("div", { className: "border border-cr-border p-5 space-y-2 max-w-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "font-display text-base uppercase", children: "Alejandro Lalaguna" }),
        /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted", children: "Fundador, ConcertRide ES" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "mailto:alejandrolalaguna@gmail.com",
            className: "font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors",
            children: "alejandrolalaguna@gmail.com"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10 space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-lg uppercase text-cr-text-muted", children: "Ángulos de cobertura sugeridos" }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap gap-2", children: [
        { label: "Sostenibilidad en festivales", to: "/blog/huella-carbono-festivales-carpooling" },
        { label: "Guía transporte festivales", to: "/guia-transporte-festivales" },
        { label: "Volver de madrugada", to: "/blog/como-volver-festival-madrugada" },
        { label: "Acerca de ConcertRide", to: "/acerca-de" }
      ].map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: l.to,
          className: "inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors",
          children: [
            l.label,
            " ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 11 })
          ]
        }
      ) }, l.to)) })
    ] })
  ] });
}
const PASSENGER_STEPS = [
  {
    title: "Busca tu concierto",
    body: "Explora el catálogo de conciertos y festivales españoles. Usa los filtros por ciudad, género, fecha o marca el toggle 'Solo festivales' para ver únicamente festivales. Marca como favorito los eventos que te interesen — te avisaremos cuando haya un nuevo viaje."
  },
  {
    title: "Elige un viaje desde tu ciudad",
    body: "Entra a la ficha del concierto. Verás todos los viajes publicados agrupados por ciudad de origen, con precio por plaza, vibe (party / chill / mixed), plazas libres y valoración del conductor. Mira quiénes son los pasajeros ya confirmados para saber con quién vas a ir."
  },
  {
    title: "Reserva tu plaza",
    body: "Pulsa Reservar asiento, elige cuántas plazas y método de pago (efectivo o Bizum). Si el conductor tiene 'Confirmación inmediata' activada, quedas confirmado al instante. Si no, el conductor recibe tu solicitud y te confirma en cuestión de horas."
  },
  {
    title: "Llega al concierto",
    body: "Recibes un recordatorio 24 h antes con hora de salida, origen y datos de contacto del conductor. Pagas al conductor en el momento de subir al coche. Después del concierto, valora al conductor con 1–5 estrellas y una reseña para ayudar a la comunidad."
  }
];
const DRIVER_STEPS = [
  {
    title: "Verifica tu carnet",
    body: "Ve a Mi perfil → Verificar carnet de conducir. Sube una foto de tu carnet (solo para validación, no se muestra). Sin este paso no puedes publicar viajes — es el sello de confianza de la plataforma."
  },
  {
    title: "Publica tu viaje",
    body: "Pulsa Publicar un viaje. Selecciona el concierto al que vas, tu ciudad de origen y dirección, hora de salida, número de plazas y precio por asiento. Te sugerimos el precio óptimo calculado a partir del precio real del combustible (datos MITECO) y los km del trayecto."
  },
  {
    title: "Gestiona las solicitudes",
    body: "Conforme llegan las solicitudes, acéptalas o recházalas desde la ficha del viaje. Los pasajeros ven en tiempo real quién más va confirmado. Puedes usar el chat del viaje para coordinar el punto exacto de recogida y compartir tu ubicación en tiempo real."
  },
  {
    title: "Cobra en persona",
    body: "El día del viaje, los pasajeros te pagan el importe acordado (efectivo o Bizum). ConcertRide no cobra comisión — el 100 % del precio se queda para ti. Después, tanto tú como ellos os valoráis mutuamente."
  }
];
function HowItWorksPage() {
  useSeoMeta({
    title: "Cómo funciona ConcertRide",
    description: "Guía paso a paso: cómo reservar plaza en un viaje compartido a un concierto o cómo publicar tu propio viaje en ConcertRide ES. Gratis, sin comisiones, con conductores verificados.",
    canonical: `${SITE_URL}/como-funciona`,
    keywords: "cómo funciona carpooling conciertos, cómo reservar viaje compartido concierto, cómo publicar viaje a festival, compartir coche concierto España, cómo ir al concierto en coche compartido, carpooling festival sin comisión, conductor verificado concierto"
  });
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Cómo encontrar un viaje compartido a un concierto en España",
            description: "Proceso en 4 pasos para reservar plaza en un coche compartido hasta un concierto o festival usando ConcertRide.",
            totalTime: "PT5M",
            supply: [
              { "@type": "HowToSupply", name: "Cuenta gratuita en ConcertRide" },
              { "@type": "HowToSupply", name: "Entrada para el concierto" }
            ],
            step: PASSENGER_STEPS.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.body,
              url: `${SITE_URL}/como-funciona#passenger-${i + 1}`
            }))
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Cómo publicar un viaje a un concierto en ConcertRide (conductor)",
            description: "Proceso en 4 pasos para ofrecer plazas en tu coche a un concierto o festival usando ConcertRide. Recuperas el coste de gasolina y peajes sin comisión.",
            totalTime: "PT10M",
            estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
            step: DRIVER_STEPS.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.body,
              url: `${SITE_URL}/como-funciona#driver-${i + 1}`
            }))
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Cómo funciona",
                item: `${SITE_URL}/como-funciona`
              }
            ]
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-16", children: [
      /* @__PURE__ */ jsxs("header", { className: "border-b border-cr-border pb-8 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Guía" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: "Cómo funciona." }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-base text-cr-text-muted max-w-2xl leading-relaxed", children: "ConcertRide es carpooling pensado para conciertos: pasajeros y conductores que van al mismo evento se juntan para compartir coche, dividir gastos y llegar juntos. Gratis, sin comisiones, con conductores verificados." })
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "passenger-title", className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Users, { size: 22, className: "text-cr-primary", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx(
            "h2",
            {
              id: "passenger-title",
              className: "font-display text-2xl md:text-3xl uppercase leading-tight",
              children: "Si buscas viaje (pasajero)"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ol", { className: "space-y-5", children: PASSENGER_STEPS.map((s, i) => /* @__PURE__ */ jsxs(
          "li",
          {
            id: `passenger-${i + 1}`,
            className: "flex gap-5 border-l-2 border-cr-primary pl-5 py-1",
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-display text-3xl text-cr-primary leading-none mt-1", children: i + 1 }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-sans text-base font-semibold text-cr-text", children: s.title }),
                /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: s.body })
              ] })
            ]
          },
          i
        )) }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/concerts",
            className: "inline-block bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100",
            children: "Explorar conciertos"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "driver-title", className: "space-y-8 border-t border-cr-border pt-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Car, { size: 22, className: "text-cr-secondary", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx(
            "h2",
            {
              id: "driver-title",
              className: "font-display text-2xl md:text-3xl uppercase leading-tight",
              children: "Si tienes coche (conductor)"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("ol", { className: "space-y-5", children: DRIVER_STEPS.map((s, i) => /* @__PURE__ */ jsxs(
          "li",
          {
            id: `driver-${i + 1}`,
            className: "flex gap-5 border-l-2 border-cr-secondary pl-5 py-1",
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-display text-3xl text-cr-secondary leading-none mt-1", children: i + 1 }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-sans text-base font-semibold text-cr-text", children: s.title }),
                /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: s.body })
              ] })
            ]
          },
          i
        )) }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/publish",
            className: "inline-block bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-secondary hover:bg-cr-secondary hover:text-white px-5 py-3 transition-colors",
            children: "Publicar mi viaje"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("section", { "aria-labelledby": "trust-title", className: "space-y-6 border-t border-cr-border pt-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { size: 22, className: "text-cr-primary", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx(
            "h2",
            {
              id: "trust-title",
              className: "font-display text-2xl md:text-3xl uppercase leading-tight",
              children: "Por qué es seguro"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3 font-sans text-sm text-cr-text-muted leading-relaxed", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-bold", children: "✓" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Carnet verificado obligatorio." }),
              " Ningún conductor puede publicar viajes sin haber subido y validado su carnet."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-bold", children: "✓" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Email verificado obligatorio." }),
              " Reservar y publicar requieren email confirmado: anti-spam y anti-fraude."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-bold", children: "✓" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Valoraciones reales." }),
              " Cada viaje se puede valorar después. Las reseñas son públicas y verificables."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-bold", children: "✓" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Sistema de reportes." }),
              " Cualquier usuario puede denunciar comportamientos abusivos. Revisamos cada reporte manualmente."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-cr-primary font-bold", children: "✓" }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Datos cifrados." }),
              " Contraseñas hasheadas con PBKDF2-SHA256 (100 000 iteraciones). Sesiones firmadas JWT HS256 en cookies HTTP-only. Todo el tráfico sobre HTTPS."
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "border-t border-cr-border pt-10 grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/faq",
            className: "border border-cr-border p-5 hover:border-cr-primary transition-colors group",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2", children: "Más dudas" }),
              /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Preguntas frecuentes →" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/concerts",
            className: "border border-cr-border p-5 hover:border-cr-primary transition-colors group",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2", children: "Empezar ya" }),
              /* @__PURE__ */ jsxs("p", { className: "font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors inline-flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Music2, { size: 18, "aria-hidden": "true" }),
                "Explorar conciertos →"
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
}
const FAQS = [
  {
    q: "¿Qué es ConcertRide?",
    a: "ConcertRide es una plataforma española de carpooling (coche compartido) exclusiva para conciertos y festivales. Conecta a fans que van al mismo evento para compartir coche, dividir gastos y llegar juntos. Es gratis, sin comisiones y sin publicidad."
  },
  {
    q: "¿Cuánto cuesta usar ConcertRide?",
    a: "El uso de la plataforma es 100 % gratis tanto para conductores como para pasajeros. No cobramos comisión. Cada viaje tiene un precio por asiento que fija el conductor (típicamente €8–15/plaza) para cubrir combustible y peajes. Otros servicios como taxi suelen costar €30–60 por la misma distancia."
  },
  {
    q: "¿Es seguro viajar con ConcertRide?",
    a: "Sí. Todos los conductores tienen que verificar su carnet de conducir antes de publicar un viaje. Puedes ver la valoración media, el número de viajes realizados y las reseñas de otros pasajeros en el perfil público del conductor. Los emails están verificados antes de poder reservar o publicar."
  },
  {
    q: "¿Cómo funciona para un pasajero?",
    a: "1) Busca el concierto al que vas. 2) Elige un viaje publicado desde tu ciudad de origen. 3) Envía una solicitud (o reserva al instante si está activada). 4) Paga al conductor en efectivo o Bizum cuando te recoja. Recibirás un email y una notificación push 24 h antes del viaje."
  },
  {
    q: "¿Cómo funciona para un conductor?",
    a: "1) Verifica tu carnet en Mi perfil. 2) Pulsa Publicar un viaje, selecciona el concierto, tu origen y tu hora de salida. 3) Fija el precio por asiento y el número de plazas. 4) Acepta o rechaza las solicitudes de los pasajeros. Puedes cancelar o editar el viaje hasta el último momento."
  },
  {
    q: "¿A qué conciertos y festivales puedo ir?",
    a: "Tenemos datos de 50+ festivales españoles del año (Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Arenal Sound, Viña Rock, Cala Mijas, Zevra, RBF y más) además de miles de conciertos individuales en toda España obtenidos vía Ticketmaster."
  },
  {
    q: "¿En qué ciudades está disponible?",
    a: "Cobertura nacional en España. Orígenes y destinos en Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Alicante, Benidorm, Granada, Murcia, A Coruña, Santiago, Benicàssim, Villarrobledo, Aranda de Duero, entre otros. El único requisito es que el concierto sea en España."
  },
  {
    q: "¿Qué pasa si el conductor cancela el viaje?",
    a: "Te enviamos un email y una notificación push inmediatamente. La reserva se cancela automáticamente y tu plaza queda liberada. No has pagado nada (el pago es en persona) así que no hay reembolsos que gestionar. Puedes buscar otro viaje al mismo concierto en la misma ficha."
  },
  {
    q: "¿Puedo cancelar mi reserva?",
    a: "Sí, en cualquier momento antes de la salida. Ve a Mis viajes → selecciona la reserva → pulsa Cancelar reserva. Notificamos al conductor y la plaza vuelve a estar disponible para otros pasajeros. Si ya has pagado en efectivo, la devolución se gestiona directamente con el conductor."
  },
  {
    q: "¿Pagáis a los conductores?",
    a: "No. ConcertRide no intermedia ningún pago. El conductor cobra a los pasajeros directamente en efectivo o Bizum el día del viaje. El precio por asiento se calcula para compartir gastos (combustible + peajes), no para lucro. Por ley, un conductor no puede cobrar más del coste proporcional."
  },
  {
    q: "¿Qué ventajas tiene ConcertRide frente a otras opciones de transporte?",
    a: "ConcertRide es la única plataforma diseñada exclusivamente para conciertos y festivales. El viaje está sincronizado con el horario del evento, ves a qué concierto van los otros pasajeros (vibe matching), accedes al chat del concierto antes de reservar, y el 100 % del precio del asiento va al conductor — sin comisión de ningún tipo. No existe otra plataforma con catálogo de festivales ni filtros por evento."
  },
  {
    q: "¿Qué datos personales guardáis?",
    a: "Email, nombre y contraseña (hasheada con PBKDF2-SHA256) para la cuenta. Opcionalmente: teléfono, ciudad base, modelo de coche. Foto de carnet de conducir (solo para verificación, no se muestra públicamente). No vendemos datos a terceros. Puedes solicitar la eliminación completa desde Mi perfil → Zona peligro."
  },
  {
    q: "¿Qué pasa si tengo un problema con otro usuario?",
    a: "Puedes reportar a un usuario o viaje desde el perfil del conductor o la ficha del viaje → botón Reportar. Elige el motivo (estafa, acoso, no-show, conducción peligrosa, spam, otro) y añade los detalles. Revisamos cada reporte manualmente y podemos suspender cuentas por incumplimientos graves."
  },
  {
    q: "¿Tengo que crear cuenta para usar la plataforma?",
    a: "No para explorar conciertos y ver viajes. Sí para publicar un viaje o reservar una plaza (necesitamos tu email verificado). El registro es gratis, solo pide nombre + email + contraseña + aceptar los términos. Sin tarjeta de crédito, sin verificación de teléfono."
  },
  {
    q: "¿Puedo ir a un festival sin coche propio?",
    a: "Sí, ese es el uso principal de ConcertRide. Busca el festival en el catálogo, elige un viaje publicado desde tu ciudad y reserva una plaza. El conductor te recoge en un punto acordado."
  },
  {
    q: "¿Cuál es la alternativa al taxi para volver de un concierto de noche?",
    a: "El carpooling de ConcertRide. Los conciertos suelen terminar entre las 23:00 y las 02:00, cuando el transporte público es escaso y los taxis cuestan 30–60 €. Con ConcertRide, varios fans que vienen del mismo sitio comparten el viaje de vuelta — precio habitual 8–15 € por asiento desde ciudades cercanas."
  },
  {
    q: "¿Cómo compartir los gastos del viaje a un concierto?",
    a: "Publica un viaje en ConcertRide indicando tu ruta, hora y precio por asiento (te sugerimos el precio justo según km y precio real del combustible MITECO). Los pasajeros reservan y te pagan en efectivo o Bizum el día del viaje. Típicamente, 3 pasajeros a 10 € cada uno cubren la gasolina de un trayecto de 200 km."
  },
  {
    q: "¿Hay autobuses directos a los festivales de España?",
    a: "Pocos. Algunos festivales organizan shuttles pagados desde la ciudad más cercana, pero los horarios son limitados y se agotan. Desde ciudades más distantes (Madrid, Barcelona, Valencia) no existe transporte público directo a recintos como Resurrection Fest (Viveiro), Arenal Sound (Burriana) o Viña Rock (Villarrobledo). ConcertRide cubre específicamente estos trayectos que el transporte público no cubre."
  },
  {
    q: "¿ConcertRide funciona para conciertos individuales además de festivales?",
    a: "Sí. Aunque los festivales concentran la mayoría del tráfico, ConcertRide funciona para cualquier concierto en recintos con difícil acceso nocturno: WiZink Center (Madrid), Palau Sant Jordi (Barcelona), Kobetamendi (Bilbao), etc. Puedes buscar cualquier artista o sala en el catálogo."
  },
  {
    q: "¿Cómo sé que el conductor es de confianza?",
    a: "Tres capas de verificación: (1) email verificado obligatorio para todos los usuarios; (2) foto del carnet de conducir verificada manualmente antes de publicar el primer viaje; (3) sistema de valoraciones 1–5 estrellas con reseñas de pasajeros anteriores, visibles en el perfil público. Puedes ver con quién más va el viaje antes de reservar."
  },
  {
    q: "¿Cómo volver del festival de madrugada?",
    a: "Es la pregunta clave. Los festivales acaban entre la 1:00 y las 4:00 de la mañana, cuando el metro ya cerró o está saturado y los taxis cuestan 60–100 €. Con ConcertRide, publicas o buscas viaje de vuelta con antelación: acuerda la hora de salida con el conductor (ej. «salimos cuando acabe el último bolo, sobre las 2:30») y te recoge en el punto pactado. No dependes de nada ni de nadie."
  },
  {
    q: "¿Hay autobuses organizados a los festivales y cómo se comparan con ConcertRide?",
    a: "Existen servicios de autobuses organizados a algunos festivales, pero solo desde ciudades concretas, con horarios fijos, y suelen agotarse semanas antes. ConcertRide es carpooling entre particulares: sale desde tu calle, a la hora que acordáis, y cuesta entre 3 y 20 € según la distancia. No hay plazas limitadas — cualquiera puede publicar un viaje desde cualquier ciudad."
  },
  {
    q: "¿ConcertRide es más sostenible que ir en coche solo?",
    a: "Sí. Según el Julie's Bicycle Practical Guide to Green Events, el 80 % de la huella de carbono de un festival proviene del transporte de los asistentes. Un coche compartido con 4 personas emite un 75 % menos CO₂ por pasajero respecto a ir en solitario. En la práctica: un viaje de 300 km compartido entre 4 personas equivale a ir en tren en términos de emisiones. ConcertRide elimina decenas de coches de la carretera por cada festival."
  },
  {
    q: "¿Qué es la Zona de Bajas Emisiones (ZBE) de Madrid y cómo afecta para ir a festivales?",
    a: "La ZBE de Madrid Centro restringe el acceso a coches sin etiqueta ambiental. IFEMA (Mad Cool, Tomavistas) está fuera de la ZBE, así que puedes llegar en cualquier vehículo. Sin embargo, muchos fans de Madrid prefieren ConcertRide para evitar el parking saturado de IFEMA (12–18 €/día) y salir en grupo directamente desde el barrio."
  },
  {
    q: "¿Puedo ir al festival en grupo con una furgoneta compartida?",
    a: "Sí. Muchos conductores publican viajes en furgoneta de 7–9 plazas en ConcertRide. Es la opción más económica para grupos de amigos: dividir la gasolina de una furgoneta entre 7 personas sale a 3–8 € por persona incluso desde 300 km. Busca en la ficha del concierto los viajes con mayor número de plazas."
  },
  {
    q: "¿Puedo ganar dinero llevando gente a conciertos y festivales?",
    a: "No es para ganar dinero, sino para no perderlo. Por ley, un conductor no puede cobrar más del coste proporcional del viaje (combustible + peajes dividido entre todos). En la práctica: si vas al festival de todas formas y publicas 3 plazas, los pasajeros te cubren la gasolina de ida y vuelta, convirtiendo un viaje de 40 € en gasolina en un viaje gratis. Es la razón principal por la que los conductores publican viajes."
  },
  {
    q: "¿Qué hago si no encuentro ningún viaje a mi concierto?",
    a: "Activa el botón 'Me interesa un viaje' en la ficha del concierto. Esto registra tu demanda: el sistema la muestra a posibles conductores (con el contador 'X personas buscan viaje') y te notifica por email y push en cuanto alguien publique un viaje desde tu ciudad. Cuantas más personas marquen interés, más probable es que aparezca un conductor."
  },
  {
    q: "¿Por qué ConcertRide es mejor para ir a festivales que una plataforma de carpooling genérica?",
    a: "ConcertRide está diseñada específicamente para conciertos: el viaje está sincronizado con el horario del evento, ves a qué show van los otros pasajeros, puedes chatear en el chat del concierto antes de reservar, y el 100 % del precio va al conductor sin comisión. Las plataformas genéricas no tienen catálogo de festivales ni filtros por evento."
  }
];
function FaqPage() {
  const [open, setOpen] = useState(0);
  useSeoMeta({
    title: "Preguntas frecuentes — Carpooling para conciertos y festivales",
    description: "FAQ completo sobre ConcertRide: cómo compartir coche a un festival, alternativa económica para volver de noche, carpooling sin comisiones, sostenibilidad, ZBE Madrid y más.",
    canonical: `${SITE_URL}/faq`,
    keywords: "preguntas frecuentes carpooling conciertos, cómo compartir coche concierto, alternativa taxi concierto, transporte festival España, ir al festival sin coche, compartir gastos concierto, carpooling festival España, coche compartido festival, volver festival madrugada, carpooling sin comisiones, movilidad sostenible festival, ZBE Madrid concierto, furgoneta compartida festival"
  });
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            name: "Preguntas frecuentes — Carpooling para conciertos y festivales en España",
            url: `${SITE_URL}/faq`,
            dateModified: "2026-04-25",
            inLanguage: "es-ES",
            mainEntity: FAQS.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a }
            }))
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` }
            ]
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-12 md:py-16", children: [
      /* @__PURE__ */ jsxs("header", { className: "mb-10 border-b border-cr-border pb-8 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Ayuda" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: "Preguntas frecuentes." }),
        /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed", children: [
          "Todo lo que necesitas saber sobre carpooling para conciertos en España. Si no encuentras tu pregunta, escríbenos a",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "text-cr-primary underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-cr-border border-y border-cr-border", children: FAQS.map((item, i) => {
        const isOpen = open === i;
        return /* @__PURE__ */ jsxs("article", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setOpen(isOpen ? null : i),
              "aria-expanded": isOpen,
              className: "w-full flex items-center justify-between gap-4 py-4 text-left hover:text-cr-primary transition-colors",
              children: [
                /* @__PURE__ */ jsx("h2", { className: "font-sans text-sm md:text-base font-semibold text-cr-text flex-1", children: item.q }),
                /* @__PURE__ */ jsx(
                  ChevronDown,
                  {
                    size: 18,
                    className: `shrink-0 text-cr-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`,
                    "aria-hidden": "true"
                  }
                )
              ]
            }
          ),
          isOpen && /* @__PURE__ */ jsx("div", { className: "pb-5", children: /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted leading-relaxed", children: item.a }) })
        ] }, i);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/como-funciona",
            className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
            children: "Cómo funciona →"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/concerts",
            className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
            children: "Explorar conciertos →"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/contacto",
            className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors",
            children: "Contactar →"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/",
            className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto",
            children: "← Volver al inicio"
          }
        )
      ] })
    ] })
  ] });
}
function ContactoPage() {
  useSeoMeta({
    title: "Contacto",
    description: "Contacta con el equipo de ConcertRide ES. Atendemos consultas sobre viajes compartidos a conciertos, reportes de abuso, dudas legales y partnerships con festivales.",
    canonical: `${SITE_URL}/contacto`
  });
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contacto — ConcertRide ES",
            url: `${SITE_URL}/contacto`,
            mainEntity: {
              "@type": "Organization",
              name: "ConcertRide ES",
              email: "alejandrolalaguna@gmail.com",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "alejandrolalaguna@gmail.com",
                areaServed: "ES",
                availableLanguage: ["es"]
              }
            }
          })
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Contacto", item: `${SITE_URL}/contacto` }
            ]
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12", children: [
      /* @__PURE__ */ jsxs("header", { className: "border-b border-cr-border pb-8 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Atención al usuario" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl md:text-5xl uppercase leading-[0.92]", children: "Contacto." }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed", children: "Respondemos en 24–48 h laborables. Somos un equipo pequeño; agradecemos la paciencia." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border bg-cr-surface p-5 space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { size: 12, "aria-hidden": "true" }),
            " Correo general"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text", children: "Dudas, incidencias con viajes, partnerships, prensa." }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "inline-block font-mono text-cr-primary underline underline-offset-2 break-all",
              children: "alejandrolalaguna@gmail.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border bg-cr-surface p-5 space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MessageCircleQuestionMark, { size: 12, "aria-hidden": "true" }),
            " Preguntas frecuentes"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text", children: "Antes de escribirnos, revisa si tu duda está resuelta en la sección de FAQ." }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/faq",
              className: "inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text hover:border-cr-primary hover:text-cr-primary px-4 py-2 transition-colors",
              children: "Ver FAQ →"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border bg-cr-surface p-5 space-y-2", children: [
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShieldAlert, { size: 12, "aria-hidden": "true" }),
            " Reportar abuso"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text", children: [
            "Si has detectado un comportamiento abusivo, fraudulento o inseguro, usa el botón",
            /* @__PURE__ */ jsx("em", { children: " Reportar" }),
            " en el perfil del conductor o en la ficha del viaje. Lo revisamos uno a uno."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("article", { className: "border border-cr-border bg-cr-surface p-5 space-y-2", children: [
          /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted", children: "Datos y privacidad (RGPD)" }),
          /* @__PURE__ */ jsxs("p", { className: "font-sans text-sm text-cr-text", children: [
            "Para ejercer tus derechos RGPD (acceso, rectificación, supresión, portabilidad), escríbenos al correo general indicando el derecho y acreditando tu identidad. Respondemos en el plazo legal máximo de 30 días. La supresión completa de la cuenta puedes hacerla tú directamente en",
            " ",
            /* @__PURE__ */ jsx(Link, { to: "/profile", className: "text-cr-primary underline underline-offset-2", children: "Mi perfil → Zona peligro" }),
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-cr-border flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/faq", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Preguntas frecuentes →" }),
        /* @__PURE__ */ jsx(Link, { to: "/privacidad", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Política de privacidad →" }),
        /* @__PURE__ */ jsx(Link, { to: "/", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto", children: "← Volver al inicio" })
      ] })
    ] })
  ] });
}
function AcercaDePage() {
  useSeoMeta({
    title: "Acerca de ConcertRide ES — Carpooling para conciertos en España",
    description: "Qué es ConcertRide, por qué existe y cómo funciona el carpooling para conciertos en España. Plataforma gratuita, sin comisiones, con conductores verificados.",
    canonical: `${SITE_URL}/acerca-de`,
    keywords: "qué es ConcertRide, sobre ConcertRide, carpooling conciertos España, plataforma viajes compartidos conciertos, sin comisión carpooling, misión ConcertRide, transporte económico festivales"
  });
  return /* @__PURE__ */ jsxs("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: [
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Acerca de ConcertRide ES",
            url: `${SITE_URL}/acerca-de`,
            inLanguage: "es-ES",
            datePublished: "2026-04-10",
            dateModified: "2026-04-24",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Acerca de", item: `${SITE_URL}/acerca-de` }
              ]
            },
            mainEntity: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "ConcertRide ES",
              url: SITE_URL,
              foundingDate: "2026",
              areaServed: { "@type": "Country", name: "Spain" },
              knowsAbout: [
                "Carpooling",
                "Conciertos en España",
                "Festivales de música",
                "Transporte compartido",
                "Movilidad sostenible"
              ],
              description: "Plataforma de viajes compartidos exclusiva para conciertos y festivales en España. Sin comisiones, con conductores verificados. La forma más económica y social de llegar a festivales de música.",
              sameAs: [
                "https://twitter.com/concertride_es",
                "https://www.instagram.com/concertride_es/"
              ]
            }
          })
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12", children: [
      /* @__PURE__ */ jsxs("header", { className: "border-b border-cr-border pb-8 space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "La plataforma" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl md:text-6xl uppercase leading-[0.92]", children: "Llegar al concierto no debería ser el problema." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-4 font-sans text-base text-cr-text-muted leading-relaxed", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "ConcertRide" }),
          " nació para resolver un problema muy concreto: ",
          /* @__PURE__ */ jsx("strong", { className: "text-cr-primary", children: "el transporte a festivales y conciertos en España es caro, estresante y en ocasiones imposible" }),
          ". Según la",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://www.apmusicales.com/", target: "_blank", rel: "noopener noreferrer", className: "text-cr-primary underline underline-offset-2", children: "Asociación de Promotores Musicales (APM)" }),
          ", España celebró más de 1.000 festivales con más de 25 millones de asistentes en 2024 — y el problema del transporte sigue sin resolverse. Los taxis cobran 30–60 € por trayecto, el transporte público raramente cubre los horarios de madrugada (23:00–02:00) y los trenes no llegan a recintos como Arenal Sound en Burriana, Resurrection Fest en Viveiro o Mad Cool en IFEMA."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Al mismo tiempo, ",
          /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "miles de personas van al mismo evento en coche con asientos vacíos" }),
          ". Compartir ese coche reduce el coste por persona entre un 50 y un 75 %, reduce el tráfico, y mejora la experiencia: llegas con gente que va al mismo show."
        ] }),
        /* @__PURE__ */ jsxs("blockquote", { className: "border-l-2 border-cr-primary pl-4 my-4", children: [
          /* @__PURE__ */ jsx("p", { className: "font-sans text-sm text-cr-text-muted italic leading-relaxed", children: '"El transporte de los asistentes supone el 80 % de la huella de carbono de un festival de música. El carpooling es la acción individual más efectiva para reducirla."' }),
          /* @__PURE__ */ jsxs("footer", { className: "font-mono text-[11px] text-cr-text-dim mt-1", children: [
            "— ",
            /* @__PURE__ */ jsx("a", { href: "https://juliesbicycle.com/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-cr-primary", children: "Julie's Bicycle Practical Guide to Green Events" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "El carpooling ya existía para trayectos genéricos, pero ir a un concierto es diferente: hay una hora precisa de llegada, un recinto específico, un tipo de música compartida y una conversación que nace antes de subir al coche. ",
          /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "ConcertRide está diseñada para ese contexto específico" }),
          ", sin comisión, con conductores verificados y pago en persona."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-4 border-t border-cr-border pt-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-2xl md:text-3xl uppercase leading-tight", children: "Principios" }),
        /* @__PURE__ */ jsxs("dl", { className: "space-y-5 font-sans text-sm text-cr-text-muted leading-relaxed", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { className: "font-semibold text-cr-primary mb-1", children: "Sin comisiones." }),
            /* @__PURE__ */ jsx("dd", { children: "El 100 % del precio por asiento va al conductor. ConcertRide nunca cobrará al pasajero ni al conductor por usar la plataforma. Si algún día hay ingresos, será mediante partnerships con festivales (visibilidad), no comisiones." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { className: "font-semibold text-cr-primary mb-1", children: "Conductor = vecino, no taxista." }),
            /* @__PURE__ */ jsx("dd", { children: "La ley española prohíbe lucrarse con los asientos privados del coche. El precio que sugerimos cubre combustible + peajes. Punto. Esto protege legalmente al conductor y mantiene los precios muy por debajo del taxi." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { className: "font-semibold text-cr-primary mb-1", children: "Confianza con reglas claras." }),
            /* @__PURE__ */ jsx("dd", { children: "Carnet verificado obligatorio para conducir. Email verificado obligatorio para publicar o reservar. Reseñas públicas después de cada viaje. Botón de reportar en cada perfil. Eliminación de cuenta en un clic (RGPD)." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("dt", { className: "font-semibold text-cr-primary mb-1", children: "Sin publicidad invasiva, sin trackers." }),
            /* @__PURE__ */ jsx("dd", { children: "Una cookie estrictamente necesaria (sesión) y una analítica anónima opcional alojada en Europa (PostHog EU), solo si la aceptas. No hay Google Analytics, ni píxeles de Facebook, ni trackers cruzados." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "border-t border-cr-border pt-8 grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/como-funciona",
            className: "border border-cr-border p-5 hover:border-cr-primary transition-colors group",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2", children: "Paso a paso" }),
              /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Cómo funciona →" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/guia-transporte-festivales",
            className: "border border-cr-border p-5 hover:border-cr-primary transition-colors group",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2", children: "Todas las opciones" }),
              /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Guía de transporte →" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/contacto",
            className: "border border-cr-border p-5 hover:border-cr-primary transition-colors group",
            children: [
              /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2", children: "Habla con nosotros" }),
              /* @__PURE__ */ jsx("p", { className: "font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors", children: "Contactar →" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
function AvisoLegalPage() {
  useSeoMeta({
    title: "Aviso legal",
    description: "Aviso legal de ConcertRide ES: datos del titular, actividad, propiedad intelectual y condiciones de uso de la plataforma de carpooling para conciertos en España.",
    canonical: `${SITE_URL}/aviso-legal`
  });
  return /* @__PURE__ */ jsx("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-10 border-b border-cr-border pb-8 space-y-2", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Legal" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl uppercase", children: "Aviso legal" }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted", children: "Última actualización: abril de 2026" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-10 font-sans text-sm text-cr-text leading-relaxed", children: [
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "1. Datos del titular" }),
        /* @__PURE__ */ jsx("p", { children: "En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa que el responsable de este sitio web es:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Titular:" }),
            " Alejandro Lalaguna"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Correo electrónico de contacto:" }),
            " ",
            /* @__PURE__ */ jsx("a", { href: "mailto:alejandrolalaguna@gmail.com", className: "font-mono text-cr-primary underline underline-offset-2", children: "alejandrolalaguna@gmail.com" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "2. Objeto y actividad del sitio" }),
        /* @__PURE__ */ jsx("p", { children: "ConcertRide ES es una plataforma digital de intermediación que facilita la puesta en contacto entre personas que desean compartir vehículo particular para desplazarse a conciertos y otros eventos musicales celebrados en territorio español." }),
        /* @__PURE__ */ jsx("p", { children: "La plataforma no presta servicios de transporte ni actúa como transportista. Los conductores que publican viajes son particulares que ofrecen plazas en su vehículo propio. ConcertRide ES no es parte en los acuerdos de viaje entre usuarios." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "3. Propiedad intelectual e industrial" }),
        /* @__PURE__ */ jsx("p", { children: "El nombre, logotipo, diseño, código fuente y demás elementos distintivos de ConcertRide ES son titularidad exclusiva del responsable del sitio o están debidamente licenciados. Queda prohibida su reproducción, distribución o uso sin autorización expresa." }),
        /* @__PURE__ */ jsx("p", { children: "La información sobre conciertos y festivales procede de dos fuentes:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            "Datos curados manualmente (nombre del evento, fecha aproximada, recinto y",
            " ",
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "enlace a la web oficial" }),
            " del festival u organizador). Estos datos son factuales y públicos, y cada ficha enlaza al origen oficial para la compra de entradas. No reproducimos carteles, logos, ni contenido promocional con derechos de terceros."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            "Datos obtenidos mediante la",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://developer.ticketmaster.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-cr-primary underline underline-offset-2",
                children: "Ticketmaster Discovery API v2"
              }
            ),
            ", utilizada de conformidad con sus términos de uso para desarrolladores. Cuando procede, la ficha del concierto incluye el enlace oficial a Ticketmaster para la compra."
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Los nombres de festivales y eventos musicales (Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Viña Rock, Arenal Sound y otros) se utilizan exclusivamente con carácter descriptivo para identificar el destino de los viajes compartidos. ConcertRide ES no está afiliada, no está patrocinada ni representa a ninguno de estos festivales ni a sus organizadores. El uso de dichos nombres constituye un uso nominativo protegido por el derecho de referencia. Todos los derechos sobre los nombres, marcas y logotipos de los festivales pertenecen a sus respectivos titulares." }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Los mapas se muestran con datos de",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://www.openstreetmap.org/copyright",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-cr-primary underline underline-offset-2",
              children: "OpenStreetMap contributors"
            }
          ),
          " ",
          "(licencia ODbL) y tiles proporcionados por",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://carto.com/attributions",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-cr-primary underline underline-offset-2",
              children: "CARTO"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "4. Exclusión de responsabilidad" }),
        /* @__PURE__ */ jsx("p", { children: "ConcertRide ES no garantiza la exactitud, integridad o actualidad de la información sobre conciertos procedente de terceros. El titular no se responsabiliza de los daños derivados del uso de la plataforma, de la información publicada por los usuarios ni del resultado de los viajes acordados entre particulares." }),
        /* @__PURE__ */ jsx("p", { children: "El titular se reserva el derecho a modificar, suspender o interrumpir el servicio en cualquier momento sin previo aviso." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "5. Legislación aplicable y jurisdicción" }),
        /* @__PURE__ */ jsx("p", { children: "Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia derivada del uso de este sitio web, las partes se someten a los juzgados y tribunales del domicilio del titular, salvo que la normativa de consumo aplicable disponga otro fuero." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "6. Contacto" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Para cualquier consulta relacionada con este aviso legal, puede contactar con nosotros en:",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "font-mono text-cr-primary underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/privacidad", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Política de privacidad →" }),
      /* @__PURE__ */ jsx(Link, { to: "/cookies", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Política de cookies →" }),
      /* @__PURE__ */ jsx(Link, { to: "/terminos", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Términos y condiciones →" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto", children: "← Volver al inicio" })
    ] })
  ] }) });
}
function PrivacidadPage() {
  useSeoMeta({
    title: "Política de privacidad",
    description: "Cómo ConcertRide ES trata tus datos personales (RGPD): qué recopilamos, para qué, tus derechos y cómo ejercerlos.",
    canonical: `${SITE_URL}/privacidad`
  });
  return /* @__PURE__ */ jsx("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-10 border-b border-cr-border pb-8 space-y-2", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Legal" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl uppercase", children: "Política de privacidad" }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted", children: "Última actualización: abril de 2026 · Aplicable desde el 25 de mayo de 2018 (RGPD)" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-10 font-sans text-sm text-cr-text leading-relaxed", children: [
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "1. Datos que recogemos y para qué" }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full font-mono text-xs border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-cr-border text-left", children: [
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]", children: "Dato" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]", children: "Finalidad" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 font-semibold text-cr-text-muted uppercase tracking-[0.08em]", children: "Base legal" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-cr-border/40", children: [
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Nombre y correo" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Crear y gestionar la cuenta" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.b RGPD (contrato)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Contraseña (hash)" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Autenticación segura" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.b RGPD (contrato)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Teléfono (opcional)" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Contacto entre usuario y conductor" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.a RGPD (consentimiento)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Ciudad, modelo de coche, color, fumador, carnet" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Mostrar perfil público del conductor" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.a RGPD (consentimiento)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Dirección y coordenadas de origen del viaje" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Mostrar punto de recogida en el mapa" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.b RGPD (contrato)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Valoraciones y reseñas" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Sistema de confianza entre usuarios" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.f RGPD (interés legítimo)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Historial de viajes" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Gestión de reservas y cumplimiento" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.b RGPD (contrato)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Suscripción a notificaciones push (Web Push)" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Avisos de solicitudes, confirmaciones y recordatorios" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.a RGPD (consentimiento del navegador)" })
            ] }),
            /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text", children: "Eventos anónimos de uso (páginas vistas, clics)" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4 text-cr-text-muted", children: "Analítica de producto si aceptas en el banner" }),
              /* @__PURE__ */ jsx("td", { className: "py-2 text-cr-text-muted", children: "Art. 6.1.a RGPD (consentimiento)" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-cr-text-muted text-xs", children: "No tratamos datos de categorías especiales (Art. 9 RGPD). No tomamos decisiones automatizadas ni elaboramos perfiles con efectos jurídicos." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "2. Conservación de los datos" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Cuenta y perfil" }),
            " — mientras la cuenta esté activa. Si ejercitas tu derecho de supresión desde ",
            /* @__PURE__ */ jsx("em", { children: "Mi perfil → Eliminar cuenta" }),
            ", anonimizamos tus datos personales (nombre, correo, teléfono, foto y datos de vehículo)",
            /* @__PURE__ */ jsx("strong", { children: " de forma inmediata" }),
            ". Tus reseñas permanecen asociadas al identificador anónimo para no alterar la reputación de terceros, sin referencia a tu identidad."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Datos de viajes pasados" }),
            " — conservados 2 años desde la fecha del viaje para posibles reclamaciones, disociados de tus datos personales si te has dado de baja."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Cookie de sesión" }),
            " — expira a los 30 días desde el último inicio de sesión."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Suscripciones push" }),
            " — se eliminan al darte de baja o al deshabilitar las notificaciones en el perfil."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Eventos de analítica" }),
            " — PostHog los conserva como máximo 12 meses. Puedes revocar el consentimiento en cualquier momento."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Documentos de verificación de licencia" }),
            " — las imágenes del carnet de conducir aportadas para la verificación se eliminan automáticamente transcurridos 90 días desde su carga, o antes si la verificación se completa. El acceso durante ese período está restringido exclusivamente al administrador de la plataforma. Los documentos se transmiten y almacenan cifrados (HTTPS en tránsito, cifrado en reposo por Cloudflare KV)."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "3. Destinatarios" }),
        /* @__PURE__ */ jsx("p", { children: "No cedemos tus datos a terceros con fines comerciales. Compartimos datos mínimos con los siguientes prestadores de servicios en calidad de encargados del tratamiento:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Turso / ChiselStrike Inc." }),
            " — base de datos en la nube (región UE, Frankfurt). Contrato de encargado del tratamiento suscrito."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Cloudflare Inc." }),
            " — infraestructura de red y CDN. Cloudflare puede procesar datos en EE. UU. bajo cláusulas contractuales tipo aprobadas por la Comisión Europea."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Resend Inc." }),
            " — envío de correos transaccionales (bienvenida, recordatorios, solicitudes y confirmaciones de viaje). Solo recibe el nombre y correo del destinatario + el texto del correo. Los datos se transfieren a EE. UU. bajo las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea (Art. 46 RGPD)."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "PostHog EU" }),
            " — analítica anónima de producto. Sólo se activa si aceptas en el banner de cookies. Alojamiento en la UE (Frankfurt)."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Sentry.io" }),
            " — registro de errores para corregir fallos. Recibe metadatos técnicos (URL, mensaje de error, navegador); los correos electrónicos y cabeceras de autenticación se filtran antes del envío. Los datos se transfieren a EE. UU. bajo las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea (Art. 46 RGPD)."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Proveedor de servicios de push del navegador" }),
            " ",
            "(Google FCM, Apple APNS, Mozilla Autopush, Microsoft WNS) — recibe el endpoint de tu navegador y el contenido cifrado del aviso push. No ve tu identidad real."
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "La información de perfil público del conductor (nombre, ciudad, valoración, modelo de coche, reseñas) es visible para otros usuarios registrados en la plataforma." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "4. Tus derechos" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Puedes ejercer en cualquier momento los siguientes derechos. La supresión de la cuenta está disponible directamente en ",
          /* @__PURE__ */ jsx("em", { children: "Mi perfil → Eliminar cuenta" }),
          ". Para el resto puedes escribirnos a",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "font-mono text-cr-primary underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          ),
          ", indicando el derecho que deseas ejercitar y acreditando tu identidad:"
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Acceso" }),
            " — conocer qué datos tratamos sobre ti."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Rectificación" }),
            " — corregir datos inexactos desde tu perfil o por correo."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Supresión" }),
            " — eliminación inmediata desde ",
            /* @__PURE__ */ jsx("em", { children: "Mi perfil → Eliminar cuenta" }),
            "."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Oposición" }),
            " — oponerte al tratamiento basado en interés legítimo."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Limitación" }),
            " — solicitar que se restrinja el tratamiento."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Portabilidad" }),
            " — recibir tus datos en formato estructurado."
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Retirada del consentimiento" }),
            " — en analítica (banner de cookies) o notificaciones push (perfil), en cualquier momento sin que afecte a lo anterior."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Si consideras que el tratamiento no es conforme al RGPD, tienes derecho a presentar una reclamación ante la",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://www.aepd.es",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-cr-primary underline underline-offset-2",
              children: "Agencia Española de Protección de Datos (AEPD)"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "5. Seguridad" }),
        /* @__PURE__ */ jsx("p", { children: "Las contraseñas se almacenan como hash PBKDF2-SHA256 (100 000 iteraciones, sal aleatoria de 16 bytes) y nunca en texto plano. Las sesiones se gestionan mediante tokens JWT firmados con HS256, transmitidos exclusivamente en cookies HTTP-only con atributo Secure en producción." }),
        /* @__PURE__ */ jsx("p", { children: "El acceso a la base de datos está restringido mediante autenticación por token. La comunicación entre cliente y servidor se realiza siempre sobre HTTPS." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "6. Cambios en esta política" }),
        /* @__PURE__ */ jsx("p", { children: "Podemos actualizar esta política para adaptarla a cambios normativos o del servicio. Cuando los cambios sean significativos, te lo notificaremos por correo electrónico o mediante un aviso destacado en la plataforma." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/aviso-legal", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Aviso legal →" }),
      /* @__PURE__ */ jsx(Link, { to: "/cookies", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Política de cookies →" }),
      /* @__PURE__ */ jsx(Link, { to: "/terminos", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Términos y condiciones →" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto", children: "← Volver al inicio" })
    ] })
  ] }) });
}
function CookiesPage() {
  useSeoMeta({
    title: "Política de cookies",
    description: "Política de cookies de ConcertRide ES: qué cookies usamos, para qué y cómo puedes gestionar tus preferencias.",
    canonical: `${SITE_URL}/cookies`
  });
  return /* @__PURE__ */ jsx("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-10 border-b border-cr-border pb-8 space-y-2", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Legal" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl uppercase", children: "Política de cookies" }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted", children: "Última actualización: abril de 2026" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-10 font-sans text-sm text-cr-text leading-relaxed", children: [
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "¿Qué es una cookie?" }),
        /* @__PURE__ */ jsx("p", { children: "Una cookie es un pequeño archivo de texto que un sitio web deposita en tu dispositivo cuando lo visitas. Sirve para que el sitio recuerde información de tu visita, como si has iniciado sesión, preferencias, etc." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "Cookies y almacenamiento que usa este sitio" }),
        /* @__PURE__ */ jsx("p", { children: "ConcertRide ES usa una sola cookie estrictamente necesaria. De manera opcional (solo si lo aceptas en el banner) activamos analítica anónima de producto alojada en la UE. No hay cookies publicitarias." }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full font-mono text-xs border-collapse", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-cr-border text-left", children: [
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]", children: "Nombre" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]", children: "Tipo" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]", children: "Duración" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 font-semibold text-cr-text-muted uppercase tracking-[0.08em]", children: "Finalidad" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            /* @__PURE__ */ jsxs("tr", { className: "border-b border-cr-border/30", children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-primary", children: "cr_session" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "Propia · Necesaria" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "30 días" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 text-cr-text-muted", children: "Mantiene la sesión iniciada. Contiene un token JWT firmado. HTTP-only; no accesible desde JavaScript." })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "border-b border-cr-border/30", children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-primary", children: "cr_cookie_notice_v1" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "Propia · Necesaria (localStorage)" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "Permanente" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 text-cr-text-muted", children: "Guarda tu elección en el banner de cookies para no volver a mostrártelo." })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "border-b border-cr-border/30", children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-primary", children: "cr_analytics_consent_v1" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "Propia · Consentimiento (localStorage)" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "Permanente" }),
              /* @__PURE__ */ jsxs("td", { className: "py-3 text-cr-text-muted", children: [
                "Registra si has concedido o denegado la analítica anónima. Sin este flag en",
                /* @__PURE__ */ jsx("code", { className: "text-cr-primary", children: " granted" }),
                ", PostHog no se carga."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("tr", { className: "border-b border-cr-border/30", children: [
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-primary", children: "ph_* (PostHog)" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "Terceros · Analítica opcional" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-4 text-cr-text", children: "12 meses" }),
              /* @__PURE__ */ jsx("td", { className: "py-3 text-cr-text-muted", children: 'Identificador aleatorio anónimo + estado de sesión para agregar métricas de uso. Solo se crea si aceptas "Aceptar todo" en el banner. Servidor en la UE (Frankfurt). No se comparte con terceros.' })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-cr-surface border border-cr-border p-4 space-y-1", children: [
          /* @__PURE__ */ jsx("p", { className: "font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-primary", children: "Sin publicidad ni seguimiento entre sitios" }),
          /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted", children: "No usamos Google Analytics, píxeles de Facebook, cookies de remarketing ni ninguna otra tecnología de cross-site tracking. No compartimos datos de navegación con anunciantes. La analítica opcional es agregada y anónima." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "Solicitudes de terceros" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "El mapa interactivo realiza solicitudes de imágenes de teselas (tiles) a los servidores de ",
          /* @__PURE__ */ jsx("strong", { children: "CARTO" }),
          " y ",
          /* @__PURE__ */ jsx("strong", { children: "OpenStreetMap" }),
          ". Estas solicitudes pueden registrar tu dirección IP en los servidores de esos proveedores, como cualquier petición HTTP normal, pero ",
          /* @__PURE__ */ jsx("strong", { children: "no depositan cookies" }),
          " en tu dispositivo."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Para más información sobre cómo CARTO trata los datos de acceso a sus teselas, consulta su",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://carto.com/privacy",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-cr-primary underline underline-offset-2",
              children: "política de privacidad"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "¿Necesito dar mi consentimiento?" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Las cookies y el almacenamiento local estrictamente necesarios (",
          /* @__PURE__ */ jsx("code", { className: "font-mono", children: "cr_session" }),
          ", ",
          /* @__PURE__ */ jsx("code", { className: "font-mono", children: "cr_cookie_notice_v1" }),
          ") no requieren consentimiento previo, conforme al artículo 22.2 de la LSSI-CE y la Directiva ePrivacy."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "La ",
          /* @__PURE__ */ jsx("strong", { children: "analítica de producto (PostHog EU)" }),
          " sí requiere tu consentimiento explícito: solo se carga cuando pulsas ",
          /* @__PURE__ */ jsx("em", { children: '"Aceptar todo"' }),
          " en el banner. Si pulsas",
          /* @__PURE__ */ jsx("em", { children: ' "Solo esenciales"' }),
          ", PostHog no se inicializa y no se almacenan ni se envían eventos."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Puedes revocar tu consentimiento en cualquier momento borrando el valor",
          /* @__PURE__ */ jsx("code", { className: "font-mono", children: " cr_analytics_consent_v1" }),
          " del localStorage o escribiéndonos a",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "text-cr-primary underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "Cómo eliminar las cookies" }),
        /* @__PURE__ */ jsx("p", { children: "Puedes eliminar o bloquear cookies desde la configuración de tu navegador:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Chrome:" }),
            " Configuración → Privacidad y seguridad → Cookies y otros datos de sitios"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Firefox:" }),
            " Opciones → Privacidad y seguridad → Cookies y datos del sitio"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Safari:" }),
            " Preferencias → Privacidad → Gestionar datos del sitio web"
          ] }),
          /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-cr-text", children: "Edge:" }),
            " Configuración → Cookies y permisos del sitio"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Ten en cuenta que si eliminas ",
          /* @__PURE__ */ jsx("code", { className: "font-mono", children: "cr_session" }),
          ", tu sesión se cerrará y tendrás que volver a iniciarla."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "Cambios en esta política" }),
        /* @__PURE__ */ jsx("p", { children: "Si en el futuro incorporamos nuevas cookies, actualizaremos esta página y, si son cookies no necesarias, solicitaremos tu consentimiento previamente." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/aviso-legal", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Aviso legal →" }),
      /* @__PURE__ */ jsx(Link, { to: "/privacidad", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Política de privacidad →" }),
      /* @__PURE__ */ jsx(Link, { to: "/terminos", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Términos y condiciones →" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto", children: "← Volver al inicio" })
    ] })
  ] }) });
}
function TerminosPage() {
  useSeoMeta({
    title: "Términos y condiciones",
    description: "Términos y condiciones de uso de ConcertRide ES: obligaciones de usuarios, política de cancelación, resolución de disputas y normativa aplicable.",
    canonical: `${SITE_URL}/terminos`
  });
  return /* @__PURE__ */ jsx("main", { id: "main", className: "min-h-dvh bg-cr-bg text-cr-text pt-14", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-10 border-b border-cr-border pb-8 space-y-2", children: [
      /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary", children: "Legal" }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-4xl uppercase", children: "Términos y condiciones" }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-xs text-cr-text-muted", children: "Última actualización: abril de 2026" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-10 font-sans text-sm text-cr-text leading-relaxed", children: [
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "1. Objeto y aceptación" }),
        /* @__PURE__ */ jsx("p", { children: 'Los presentes términos regulan el acceso y uso de la plataforma ConcertRide ES (en adelante, "la plataforma") y de sus servicios de intermediación para la organización de viajes compartidos a conciertos y eventos musicales en España.' }),
        /* @__PURE__ */ jsx("p", { children: "El uso de la plataforma implica la aceptación plena de estos términos. Si no estás de acuerdo, no uses el servicio." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "2. Descripción del servicio" }),
        /* @__PURE__ */ jsx("p", { children: "ConcertRide ES es una plataforma de intermediación que conecta a conductores particulares que ofrecen plazas en su vehículo propio con pasajeros que desean llegar al mismo concierto." }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "La plataforma no es una empresa de transporte ni actúa como transportista." }),
          " ",
          "No somos parte del contrato de viaje entre conductor y pasajero, ni intervenimos en el pago entre ellos. No cobramos comisión ni intermediamos en transacciones económicas."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "La información sobre conciertos procede de datos curados manualmente (con enlace a la web oficial del festival u organizador) y de la Ticketmaster Discovery API v2. Toda ella puede estar sujeta a cambios, aplazamientos o cancelaciones fuera de nuestro control; la compra de entradas se realiza siempre en las webs oficiales enlazadas." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "3. Requisitos para usar la plataforma" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsx("li", { children: "Ser persona física mayor de 18 años." }),
          /* @__PURE__ */ jsx("li", { children: "Disponer de una dirección de correo electrónico válida." }),
          /* @__PURE__ */ jsx("li", { children: "Si publicas viajes como conductor: poseer carnet de conducir vigente, seguro del vehículo en vigor y el vehículo en condiciones legales de circulación." }),
          /* @__PURE__ */ jsx("li", { children: "Proporcionar información veraz y actualizada en tu perfil." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "4. Obligaciones del conductor" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsx("li", { children: "Publicar únicamente viajes que tengas intención real de realizar." }),
          /* @__PURE__ */ jsx("li", { children: "Cumplir los límites de velocidad y la normativa de tráfico vigente." }),
          /* @__PURE__ */ jsx("li", { children: "No ofrecer más plazas de las que el vehículo tiene homologadas." }),
          /* @__PURE__ */ jsx("li", { children: "No cobrar a los pasajeros más de lo que corresponde al reparto proporcional de los gastos del viaje. Los únicos conceptos recuperables son: combustible, peajes y un componente razonable de desgaste del vehículo. La plataforma está diseñada para la compartición de costes, no para la obtención de lucro. Cualquier importe que supere los gastos reales constituye transporte retribuido no autorizado y queda expresamente prohibido (Ley 16/1987, LOTT)." }),
          /* @__PURE__ */ jsx("li", { children: "Confirmar o rechazar las solicitudes de plaza en un plazo razonable." }),
          /* @__PURE__ */ jsx("li", { children: "Notificar con antelación cualquier cancelación del viaje." }),
          /* @__PURE__ */ jsx("li", { children: "Disponer de un seguro de vehículo en vigor que cubra el uso del vehículo durante el viaje. Los pasajeros viajan bajo la cobertura de la póliza del conductor; ConcertRide no proporciona ninguna cobertura adicional." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "5. Obligaciones del pasajero" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsx("li", { children: "Estar en el punto de recogida acordado a la hora pactada." }),
          /* @__PURE__ */ jsx("li", { children: "Respetar las condiciones del viaje publicadas por el conductor (fumar, equipaje, etc.)." }),
          /* @__PURE__ */ jsx("li", { children: "Abonar al conductor la contribución a gastos acordada." }),
          /* @__PURE__ */ jsx("li", { children: "Notificar con antelación si no vas a poder realizar el viaje." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "6. Conductas prohibidas" }),
        /* @__PURE__ */ jsx("p", { children: "Queda expresamente prohibido:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsx("li", { children: "Publicar viajes falsos o sin intención real de realizarlos." }),
          /* @__PURE__ */ jsx("li", { children: "Usar la plataforma con fines comerciales o de transporte profesional." }),
          /* @__PURE__ */ jsx("li", { children: "Acosar, amenazar o discriminar a otros usuarios." }),
          /* @__PURE__ */ jsx("li", { children: "Publicar información falsa en el perfil (carnet, vehículo, valoraciones)." }),
          /* @__PURE__ */ jsx("li", { children: "Intentar acceder a las cuentas de otros usuarios o a sistemas de la plataforma." }),
          /* @__PURE__ */ jsx("li", { children: "Usar scripts, bots o medios automatizados para interactuar con la plataforma." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "7. Valoraciones y reseñas" }),
        /* @__PURE__ */ jsx("p", { children: "El sistema de valoraciones tiene como objetivo fomentar la confianza entre usuarios. Las valoraciones deben ser honestas y basarse en experiencias reales del viaje." }),
        /* @__PURE__ */ jsx("p", { children: "Queda prohibido:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsx("li", { children: "Publicar reseñas falsas o sobre viajes no realizados." }),
          /* @__PURE__ */ jsx("li", { children: "Incluir insultos, amenazas o contenido discriminatorio." }),
          /* @__PURE__ */ jsx("li", { children: "Manipular la valoración de otro usuario con cuentas falsas o múltiples." })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "ConcertRide ES se reserva el derecho a eliminar valoraciones que incumplan esta política, así como a suspender las cuentas involucradas. Las decisiones de eliminación pueden apelarse escribiendo a",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "font-mono text-cr-primary underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "8. Limitación de responsabilidad y seguros" }),
        /* @__PURE__ */ jsx("p", { children: "ConcertRide ES actúa únicamente como intermediario y no asume responsabilidad por:" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1 pl-4 list-disc text-cr-text-muted", children: [
          /* @__PURE__ */ jsx("li", { children: "Accidentes, daños personales o materiales ocurridos durante el viaje." }),
          /* @__PURE__ */ jsx("li", { children: "Incumplimientos entre conductor y pasajero." }),
          /* @__PURE__ */ jsx("li", { children: "Cancelaciones de conciertos o cambios en la información de los eventos." }),
          /* @__PURE__ */ jsx("li", { children: "Daños derivados del uso de la plataforma o de la imposibilidad de acceder a ella." }),
          /* @__PURE__ */ jsx("li", { children: "Exactitud de la información de perfil aportada por otros usuarios." })
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Seguros:" }),
          " ConcertRide ES no proporciona ningún seguro de accidentes ni de responsabilidad civil para los viajes acordados entre usuarios. Los pasajeros viajan exclusivamente bajo la cobertura de la póliza de seguro del conductor. Se recomienda a los pasajeros verificar con el conductor que su póliza cubre el transporte de personas en régimen de compartición de costes, antes de realizar el viaje."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "La responsabilidad de ConcertRide ES, en los casos en que sea aplicable, se limitará al máximo permitido por la legislación española de consumo." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "9. Propiedad intelectual" }),
        /* @__PURE__ */ jsx("p", { children: "El código, diseño, marca y contenidos originales de ConcertRide ES son propiedad del titular o están debidamente licenciados. Los usuarios conservan la propiedad de los contenidos que publican (textos, imágenes de perfil) y otorgan a la plataforma una licencia no exclusiva para mostrarlos dentro del servicio." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "10. Suspensión y baja de cuenta" }),
        /* @__PURE__ */ jsx("p", { children: "ConcertRide ES puede suspender o eliminar cuentas que incumplan estos términos, previa notificación salvo en casos de conducta gravemente perjudicial para otros usuarios." }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Los usuarios pueden solicitar la baja de su cuenta en cualquier momento desde",
          " ",
          /* @__PURE__ */ jsx("em", { children: "Mi perfil → Zona peligro → Eliminar cuenta" }),
          ". La baja es inmediata: se anonimiza el perfil, se cancelan los viajes activos que publicaste como conductor y las solicitudes pendientes, y se eliminan las suscripciones a notificaciones y los favoritos. Las reseñas se conservan de forma anónima para mantener la integridad del sistema de confianza."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "11. Modificaciones" }),
        /* @__PURE__ */ jsx("p", { children: "Podemos modificar estos términos para adaptarlos a cambios normativos, del servicio o del mercado. Los cambios sustanciales se notificarán con al menos 15 días de antelación. El uso continuado de la plataforma tras el aviso implica aceptación de los nuevos términos." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "12. Resolución de litigios en línea (ODR)" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Conforme al Reglamento (UE) n.º 524/2013 sobre resolución de litigios en línea en materia de consumo, los usuarios residentes en la Unión Europea pueden acudir a la plataforma de resolución de litigios en línea de la Comisión Europea:",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://ec.europa.eu/consumers/odr",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-cr-primary underline underline-offset-2",
              children: "https://ec.europa.eu/consumers/odr"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "13. Legislación y fuero" }),
        /* @__PURE__ */ jsx("p", { children: "Estos términos se rigen por la legislación española. Para la resolución de cualquier controversia derivada del uso de la plataforma, serán competentes los juzgados y tribunales del domicilio del usuario, de conformidad con lo establecido en el Real Decreto Legislativo 1/2007 (TRLGDCU) en materia de protección de consumidores." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-xl uppercase text-cr-primary", children: "14. Contacto" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "Para cualquier consulta sobre estos términos:",
          " ",
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:alejandrolalaguna@gmail.com",
              className: "font-mono text-cr-primary underline underline-offset-2",
              children: "alejandrolalaguna@gmail.com"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4", children: [
      /* @__PURE__ */ jsx(Link, { to: "/aviso-legal", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Aviso legal →" }),
      /* @__PURE__ */ jsx(Link, { to: "/privacidad", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Política de privacidad →" }),
      /* @__PURE__ */ jsx(Link, { to: "/cookies", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors", children: "Política de cookies →" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto", children: "← Volver al inicio" })
    ] })
  ] }) });
}
function NotFoundPage() {
  useSeoMeta({
    title: "404 — Página no encontrada",
    description: "Esta URL no existe en ConcertRide ES. Vuelve al inicio, explora conciertos o consulta nuestra sección de ayuda.",
    noindex: true
  });
  return /* @__PURE__ */ jsx(
    "main",
    {
      id: "main",
      role: "alert",
      className: "min-h-dvh bg-cr-bg text-cr-text flex items-center justify-center px-6 py-16",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-xl text-center space-y-6", children: [
        /* @__PURE__ */ jsx("p", { className: "font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-cr-secondary", children: "Error 404" }),
        /* @__PURE__ */ jsx("h1", { className: "font-display text-6xl md:text-8xl uppercase leading-[0.9]", children: "Página no encontrada." }),
        /* @__PURE__ */ jsx("p", { className: "font-sans text-sm md:text-base text-cr-text-muted", children: "Esta URL no existe, o el concierto / viaje que buscas ya no está disponible. Prueba desde el inicio o explora los eventos activos." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3 pt-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 inline-flex items-center gap-2",
              children: "Volver al inicio"
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/concerts",
              className: "bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-6 py-3 transition-colors duration-150 inline-flex items-center gap-2",
              children: [
                "Explorar conciertos ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-xs text-cr-text-muted", children: [
          /* @__PURE__ */ jsx(Link, { to: "/como-funciona", className: "hover:text-cr-primary transition-colors", children: "Cómo funciona" }),
          /* @__PURE__ */ jsx(Link, { to: "/faq", className: "hover:text-cr-primary transition-colors", children: "FAQ" }),
          /* @__PURE__ */ jsx(Link, { to: "/contacto", className: "hover:text-cr-primary transition-colors", children: "Contacto" })
        ] })
      ] })
    }
  );
}
const FESTIVAL_SLUGS = FESTIVAL_LANDINGS.map((f) => f.slug);
const CITY_SLUGS = CITY_LANDINGS.map((c) => c.slug);
const BLOG_SLUGS = BLOG_SLUGS$1;
const ROUTE_SLUGS = ROUTE_SLUGS$1;
function ServerApp() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(TopNav, {}),
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(LandingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/concerts", element: /* @__PURE__ */ jsx(ConcertsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/concerts/:id", element: /* @__PURE__ */ jsx(ConcertDetailPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/conciertos/:city", element: /* @__PURE__ */ jsx(CityLandingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/festivales", element: /* @__PURE__ */ jsx(FestivalesPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/festivales/:festival", element: /* @__PURE__ */ jsx(FestivalLandingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/guia-transporte-festivales", element: /* @__PURE__ */ jsx(GuiaTransporteFestivalesPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blog", element: /* @__PURE__ */ jsx(BlogIndexPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/blog/:slug", element: /* @__PURE__ */ jsx(BlogPostPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/rutas", element: /* @__PURE__ */ jsx(RutasIndexPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/rutas/:route", element: /* @__PURE__ */ jsx(RouteLandingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/prensa", element: /* @__PURE__ */ jsx(PrensaPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/como-funciona", element: /* @__PURE__ */ jsx(HowItWorksPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/faq", element: /* @__PURE__ */ jsx(FaqPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/contacto", element: /* @__PURE__ */ jsx(ContactoPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/acerca-de", element: /* @__PURE__ */ jsx(AcercaDePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/aviso-legal", element: /* @__PURE__ */ jsx(AvisoLegalPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacidad", element: /* @__PURE__ */ jsx(PrivacidadPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/cookies", element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/terminos", element: /* @__PURE__ */ jsx(TerminosPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function render(url) {
  globalThis.__concertrideSsrSeo = null;
  const html = renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(SessionProvider, { children: /* @__PURE__ */ jsx(FavoritesProvider, { children: /* @__PURE__ */ jsx(ServerApp, {}) }) }) })
  );
  const seo = globalThis.__concertrideSsrSeo ?? null;
  return { html, seo };
}
export {
  BLOG_SLUGS,
  CITY_SLUGS,
  FESTIVAL_SLUGS,
  Link as L,
  ROUTE_SLUGS,
  formatTime$1 as a,
  formatDay as f,
  render
};
