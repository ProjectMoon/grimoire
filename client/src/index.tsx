import * as injectTapEventPlugin from 'react-tap-event-plugin';
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAwesomeReactComponent from './components/MyAwesomeReactComponent';


let items: Array<string> = ['Learn react', 'Make mage app', 'Profit'];
const hello = <Hello title="Thaumaturge" />;

/* async function doItAsync(): Promise<JSX.Element> {
 *     return new Promise<JSX.Element>(resolve => {
 *         setTipmeout(() => resolve(hello));
 *     });
 * };
 *
 * async function main() {
 *     let helloElement = await doItAsync();
 *     ReactDOM.render(helloElement, document.getElementById("example"));
 * }*/

/* main();*/

const App = (
    <MuiThemeProvider>
        <Hello title="Thaumaturge" />
    </MuiThemeProvider>
);

injectTapEventPlugin();
ReactDOM.render(App, document.getElementById("example"));
