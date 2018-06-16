import { PureComponent } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

export default class Window extends PureComponent {
  static defaultProps = {
    menubar: 0,
    scrollbars: 1,
    status: 0,
    toolbar: 0,
    titlebar: 0,
  };

  window = null;

  _getFeaturesString = () =>
    Object.entries({
      top: this.props.y,
      left: this.props.x,
      width: this.props.width,
      height: this.props.height,
      menubar: this.props.menubar,
      scrollbars: this.props.scrollbars,
      status: this.props.status,
      toolbar: this.props.toolbar,
      titlebar: this.props.titlebar,
    })
      .map(([key, value]) => `${key}=${value}`)
      .join();

  _onBeforeUnload = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose(this.window);
    }
  };

  _setupDom = () => {
    const { stylesheet, title } = this.props;
    if (typeof stylesheet === "string") {
      if (stylesheet.search(/https?:\/\//) === -1) {
        console.warn("If stylesheet is provided, must be an absolute URL");
      } else {
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("href", stylesheet);
        this.window.document.head.appendChild(css);
      }
    } else {
      const parent = this.window.opener;
      parent.document.querySelectorAll("style").forEach(styleEl => {
        this.window.document.head.appendChild(styleEl.cloneNode(true));
      });
    }
    const rootEl = document.createElement("div");
    this.window.document.title = title;
    this.window.document.body.appendChild(rootEl);
    this.window.addEventListener("beforeunload", this._onBeforeUnload, {
      once: true,
    });

    return rootEl;
  };

  componentDidMount() {
    const { url, name, onBlock, onLoad } = this.props;
    this.window = window.open(url, name, this._getFeaturesString());

    if (!this.window) {
      if (onBlock) {
        onBlock();
      }
    } else {
      // NOTE: Reason to use unstable_renderSubtreeIntoContainer:
      // https://twitter.com/dan_abramov/status/774591045980024833?lang=en
      // https://github.com/facebook/react/issues/4819
      unstable_renderSubtreeIntoContainer(
        this,
        typeof this.props.children === "function"
          ? this.props.children(this.window)
          : this.props.children,
        this._setupDom()
      );

      if (onLoad) {
        onLoad(this.window);
      }
    }
  }

  componentWillUnmount() {
    this.window = null;
  }

  render() {
    return null;
  }
}
