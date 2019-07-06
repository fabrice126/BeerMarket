
# Submission Notes

### How you approached the problem

- Which features will the application have ?
	- Which data/endpoint are available in the API ?
	- Look for problems with the API (1 request/sec, count_beer is not available for pagination)
- Which design should I apply for the project ?
- Creates an easily responsive design.

### Reasoning behind any technical decisions you made

- How to manage the pagination without having the field count_beer ?
	- On page change : make a request until we retrieve no data from the api, if it's the case, we keep the old state and fill the state lastPage.

### Naming convention

-  Components (ex: `/app/components/Header`) and views (ex: `/app/views/HomePage`) should be in PascalCase format
- Folders in `/app/components` and `/app/views` should be in PascalCase format
- A view should end by 'Page' ex: `HomePage.js`
- We use BEM method for naming  CSS class (exception: when we have to style semantic-ui components)
- CSS classes used on root element for a view or a composant should be the same as the view / component name eg: `return <div className="InnerComponent"/>`
- The same for CSS class used on a component eg: `<MyComponent className="MyComponent">`
- Listeners start with `handle` eg: `handleChange`

---
### Project structure (/app)
- Components and pages must be in a folder with the same name as the component.
- The css that is global has the whole site is located inside: `/app/views/App/App.css`
#### /assets
- Various files (image, font, etc. )
#### /components
- The components of the application that will be used in a view.
#### /views
- The views of the application as well as the App component which is the root component.
#### /lib
- Functions used in views or components


---
### Add a route
- Add a new route here: `/app/routes.js`
