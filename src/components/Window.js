import { PureComponent } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import PropTypes from "prop-types";
import { attachResources } from "../utils";

const bools = ["yes", "no", 1, 0];

export default class Window extends PureComponent {
  static propTypes = {
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    menubar: PropTypes.oneOf(bools),
    scrollbars: PropTypes.oneOf(bools),
    status: PropTypes.oneOf(bools),
    toolbar: PropTypes.oneOf(bools),
    titlebar: PropTypes.oneOf(bools),
    resources: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    ),
  };

  static defaultProps = {
    menubar: 0,
    scrollbars: 1,
    status: 0,
    toolbar: 0,
    titlebar: 0,
    resources: [],
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
    const { resources, title } = this.props;
    const doc = this.window.document;
    doc.title = title;
    const rootEl = document.createElement("div");
    doc.body.appendChild(rootEl);
    attachResources(doc, resources);
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
