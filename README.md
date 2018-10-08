DatoCMS Site Search
===============

**Search Widget** is a JS library also includes a full-featured widget ready to be used in your website

## Installation

Via CDN add our JS and CSS in your page:

```html
<link rel="stylesheet" href="https://unpkg.com/datocms-search@0.1.5/styles/index.css" />
<script src="https://unpkg.com/datocms-search@0.1.5/dist/datocms-search.widget.js"></script>
```

## Documentation

You can now call `client.addWidget()` specifying the CSS Selector where the widget will be inserted:

```html
<body>
  <div id="search-container"></div>
  <script>
    var client = new DatoCmsSearch("YOUR_API_TOKEN", "production");
    client.addWidget("#search-container");
  </script>
</body>
```

If your site is multi-language, you can configure the widget to present them:

```html
<script>
  var client = new DatoCmsSearch("YOUR_API_TOKEN", "production");
  client.addWidget(
    "#search-container",
    {
      locales: [
        { label: "English", value: "en" },
        { label: "Italiano", value: "it" },
      ]
    }
  );
</script>
```

