React External Window
=====================

With **React External Window** you can render React components in an external child window from within an app. 

_Works with redux-connected components!_



## Installation

**Requires React v16** and assumes you’re using _npm_ package manager with a module bundler like _Webpack_ or _Browserify_ to consume _CommonJS_ modules.
```
npm i --save react-external-window
```



## Usage

A `Window` component accepts the following props. For more information, visit [MDN's documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) on `window.open`.

| Prop Name | Description | Default |
| --- | --- | --- |
| `url` | Do not provide one if you want to render the `children` provided to `Window` | `Empty String` |
| `title` | Title to display in title bar | `'Untitled'` |
| `name` | Name passed to `window.open` |
| `y` | Maps to `top` property of `windowFeatures` | `0` |
| `x` | Maps to `left` poperty of `windowFeatures` | `0` |
| `resources` | Array of resources to include in external window (see [Resources Example](#resources-example)) |
| `width` | Initial width in pixels of child window |
| `height` | Initial height in pixels of child window |
| `menubar` | Show menubar on child window. Acceptable values are `1`/`0`, `yes`/`no` | `0` |
| `scrollbars` | Show scrollbars on child window. Acceptable values are `1`/`0`, `yes`/`no` | `1` |
| `status` | Show status bar on child window. Acceptable values are `1`/`0`, `yes`/`no` | `0` |
| `toolbar` | Show toolbar on child window. Acceptable values are `1`/`0`, `yes`/`no` | `0` |
| `titlebar` | Show menubar on child window. Acceptable values are `1`/`0`, `yes`/`no` | `0` |
| `onLoad` | Passed reference to newly created window |
| `onClose` | Passed reference to closing window, useful for saving properties like position or size |
| `onBlock` | Calling `window.open` fails, usually due to a popup blocker |

![Parts of a Child Window](https://developer.mozilla.org/@api/deki/files/210/=FirefoxChromeToolbarsDescription7a.gif)

**React External Window** can have be supplied `children` or a `function`, which is passed the external window instance.

``` js
<Window 
    url=''
    title='My Window'
>
    //...children
</Window>
```

Using `this.props.children` as a render prop:
``` js
<Window 
    url=''
    title='My Window'
>
{(window) => (
    // ...children to render
    <button onClick={() => window.close()}>Close!</button>
)}
</Window>
```
Having access to the external window instance allows methods to be called on the external window instead of the parent window. In the example above calling `window.close()` without access to the instance would call `close` on the parent window, which is not allowed so nothing would happen.



## Example

You have an app that has some data visualizations, among them a component called `SweetChart`. You want users to see and interact with this `SweetChart` while also carrying out other tasks. With **React External Window** the `SweetChart` (probably a redux-connected component) can live in an external window without the need to load your entire site (or any site) into it.

``` js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Window from 'react-external-window';
import { actionTypes } from './reducer';
import SweetChart from './SweetChart';


class App extends Component {
    onOpenBtnClick = () => {
        this.props.onOpenBtnClick();
    }

    render() {
        return (
            <div>
                <SweetChart />
                <button onClick={this.onOpenBtnClick}>Open!</button>
                <div>{this.props.message}</div>
                {this.props.openWindow &&
                    <Window 
                        url=''
                        title='My Window'
                        name='child'
                        onClose={this.props.onCloseWindow}
                    >
                    {(window) => (
                        <React.Fragment>
                            <SweetChart />
                            <button onClick={() => window.close()}>Close!</button>
                        </React.Fragment>
                    )}
                    </Window>
                }
            </div>
        );
    } 
}

const mapStateToProps = (state) => ({
    openWindow: state.openWindow,
    message: state.message,
});

const mapDispatchToProps = (dispatch) => ({
    onOpenBtnClick: () => dispatch({ type: actionTypes.OPEN_WINDOW }),
    onCloseWindow: (window) => dispatch({ type: actionTypes.CLOSE_WINDOW, payload: window }), // save some info about the window instance to use when opening next time
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```



## Resources Example

If the external window you create uses `about:blank`, in other words, doesn't load in an actual website, you'll most likely need to supply it with the resources needed for styling and functionality. 

The example below shows how to use the `resources` prop. `resources` accepts an array of resources, each resource can be of the following format:

|  | Resource Type | Format
| --- | --- | --- | 
| 1 | `Node` or `NodeList` | `[selector, 'append'|'prepend', 'head'|'body']` | 
| 2 | Absolute URL with extension | `String` |
| 3 | Absolute URL without extension | `[url, 'js'|'css']` |
---
**Migrating from `v0.2.0` to `v1.x.x`**
Prior to `v1.0.0`, parent styles would be copied automatically if `stylesheet` was not provided a URL. That behavior has been removed in favor of the more flexible `resources` prop. To achieve the same effect, add the following to your `resources` array:

``` js
[document.querySelectorAll('style'), 'append', 'head'],
```

---

``` js
<Window
    url=""
    title="My Window"
    resources={[
        [document.querySelectorAll('style'), 'append', 'head'], // 1
        [document.querySelector('svg'), 'prepend', 'body'], // 1
        'https://kerryrusso.com/blog/wp-content/themes/grateful/css/reset.css?ver=4.9.6', // 2
        'https://kerryrusso.com/blog/wp-content/themes/grateful/style.css?ver=4.9.6', // 2
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css', // 2
        [
        'https://kerryrusso.com/blog/wp-content/themes/grateful/style',
        'css',
        ], // 3
        ['https://unpkg.com/jquery', 'js'], // 3
    ]}
    >
    {window => (
        <React.Fragment>
        <Form />
        <button
            className="btn btn-danger"
            onClick={() => {
            window.close();
            }}
        >
            Close!
        </button>
        </React.Fragment>
    )}
</Window>
```