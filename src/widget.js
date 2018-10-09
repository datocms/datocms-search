import Inferno from 'inferno';
import Component from 'inferno-component';
import createElement from 'inferno-create-element';
import objectAssign from 'object-assign';
import DatoCmsSearch from './base';

import LocalizedStrings from 'localized-strings';
import i18nFallbacksStrings from './localization';

class SearchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      query: props.initialQuery || "",
      total: null,
      results: null,
      locale: props.initialLocale || (props.locales ? props.locales[0].value : null),
      page: 0,
      isLocaleOpen: false,
      strings: new LocalizedStrings(i18nFallbacksStrings)
    };
    this.state.strings.setLanguage(props.base_locale);

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true)
    if (this.state.query) {
      this.performSearch();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true)
  }

  handleQueryChange(e) {
    this.setState({ query: e.target.value });
  }

  handleClickOutside(e) {
    if (this.localeRef && !this.localeRef.contains(e.target)) {
      this.setState({ isLocaleOpen: false });
    }
  }

  handleLocaleChange(locale, e) {
    e.preventDefault();
    this.setState({ locale, isLocaleOpen: false }, () => this.performSearch());
  }

  handleLocaleToggle(e) {
    e.preventDefault();
    this.setState({ isLocaleOpen: !this.state.isLocaleOpen });
  }

  handlePageChange(page, e) {
    e.preventDefault();

    this.setState({ page }, () => this.performSearch());
  }

  handleSubmit(e) {
    e.preventDefault();
    this.performSearch();
  }

  performSearch() {
    this.setState({ isLoading: true });

    this.props.client.search(
      this.state.query,
      {
        offset: this.state.page * this.props.perPage,
        limit: this.props.perPage,
        locale: this.state.locale,
      }
    )
      .then(({ results, total }) => {
        this.setState({ results, total, isLoading: false });
      });
  }

  render() {
    return (
      <form
        className="datocms-widget"
        onSubmit={this.handleSubmit.bind(this)}
      >
        <div className="datocms-widget__header">
          <div className="datocms-widget__header__inner">
            {this.renderSearchInput()}
            {
              this.props.locales &&
                this.renderLocales()
            }
          </div>
        </div>
        <div className="datocms-widget__body">
          {
            this.state.results &&
              <div className="datocms-widget__results">
                {this.state.results.map(this.renderResult.bind(this))}
              </div>
          }
          {
            !this.state.isLoading && (
              !this.state.results || this.state.results.length === 0
            ) &&
              <div className="datocms-widget__no-results">
                <div className="datocms-widget__no-results__label">
                  {
                    this.state.query === "" ?
                      this.state.strings.empty_search :
                      this.state.strings.formatString(this.state.strings.not_found, {val: this.state.query})
                  }
                </div>
              </div>
          }
          {
            this.state.isLoading &&
              this.renderLoading()
          }
        </div>
        <div className="datocms-widget__footer">
          {
            this.state.total !== null &&
              this.renderPagination()
          }
          {
            this.state.total !== null &&
              this.renderTotal()
          }
        </div>
      </form>
    )
  }

  renderSearchInput() {
    return (
      <div className="datocms-widget__search">
        <input
          className="datocms-widget__search__input"
          type="text"
          placeholder={this.state.strings.placeholder}
          onChange={this.handleQueryChange.bind(this)}
          value={this.state.query}
        />
      </div>
    );
  }

  renderLocales() {
    return (
      <div className="datocms-widget__locales" ref={(ref) => this.localeRef = ref}>
        <div className="datocms-widget__locales__active" onClick={this.handleLocaleToggle.bind(this)}>
          <span className="datocms-widget__locales__active__label">
            {this.state.strings.find_result}
          </span>
          <span className="datocms-widget__locales__active__value">
            {this.props.locales.find(locale => locale.value === this.state.locale).label}
          </span>
        </div>
        {
          this.state.isLocaleOpen &&
            <div className="datocms-widget__locales__menu">
              {
                this.props.locales.map((locale) => {
                  return (
                    <a
                      href="#"
                      className="datocms-widget__locales__menu__item"
                      key={locale.value}
                      onClick={this.handleLocaleChange.bind(this, locale.value)}
                    >
                      {locale.label}
                    </a>
                  );
                })
              }
            </div>
        }
      </div>
    );
  }

  renderTotal() {
    return (
      <div className="datocms-widget__total">
        <span className="datocms-widget__total__label">
          {this.state.strings.total_found}
        </span>
        <span className="datocms-widget__total__value">
          {this.state.total}
        </span>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="datocms-widget__loading">
        <div className="datocms-widget__loading__inner-1" />
        <div className="datocms-widget__loading__inner-2" />
        <div className="datocms-widget__loading__inner-3" />
        <div className="datocms-widget__loading__inner-4" />
      </div>
    );
  }

  renderPagination() {
    var pages = Math.ceil(this.state.total / this.props.perPage);
    var pagesArray = Array.apply(null, { length: pages }).map(Number.call, Number);

    return (
      <div className="datocms-widget__pagination">
        {
          pages > 1 && pagesArray.map((index) => {
            var isActive = this.state.page === index;
            var className = ["datocms-widget__pagination__page"];
            if (isActive) {
              className.push("is-active");
            }

            return (
              <a
                className={className.join(" ")}
                onClick={this.handlePageChange.bind(this, index)}
                href="#"
                key={index}
              >
                {index + 1}
              </a>
            );
          })
        }
      </div>
    );
  }

  renderResult(result) {
    return (
      <div
        className="datocms-widget__result"
        key={result.url}
      >
        <a
          className="datocms-widget__result__title"
          href={result.url}
          dangerouslySetInnerHTML={{ __html: result.title || "No title" }}
        />
        <div
          className="datocms-widget__result__body"
          dangerouslySetInnerHTML={{ __html: result.body }}
        />
        <div
          className="datocms-widget__result__url"
          dangerouslySetInnerHTML={{ __html: result.url }}
        />
      </div>
    );
  }
}

DatoCmsSearch.prototype.addWidget = function startWidget(selector, props) {
  let base_lang = (navigator.languages && navigator.languages[0]) ||
    navigator.language || navigator.userLanguage
  props.base_locale = props.initialLocale || (props.locales ? props.locales[0].value : null) || base_lang.split("-")[0]
  let i18nStrings = props.i18nStrings || {}
  if (i18nFallbacksStrings[props.base_locale] == undefined) {
    i18nFallbacksStrings[props.base_locale] = i18nStrings;
  } else {
    Object.assign(i18nFallbacksStrings[props.base_locale], i18nStrings)
  }
  props.i18nStrings = i18nFallbacksStrings;

  Inferno.render(
    createElement(SearchComponent, objectAssign({ client: this, perPage: 8 }, props)),
    document.querySelector(selector)
  );
}

module.exports = DatoCmsSearch;
