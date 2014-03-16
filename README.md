uQuery
======
> jQuery port to Unity3D

## How to get started

### [Download uQuery.js](https://raw.github.com/jehna/uQuery/master/build/uQuery.js)

1. Download the source file from the link above
2. Add the file to your Unity proect: `Assets/Plugins/uQuery.js`
3. Start coding!
4. For examples, tutorials and discussion visit: http://forum.unity3d.com/threads/157096-Weekend-project-jQuery-for-Unity-uQuery

## Contributing

Contributions are warmly welcome.

### Building the source

1. Clone the repo `git clone https://github.com/jehna/uQuery.git`
2. Install Grunt (see [official Grunt howto page](http://gruntjs.com/getting-started))
3. Run grunt in the project folder: `grunt`
     * This will build the source files to one single `build/uQuery.js` file.
     * Grunt will build automatically on any change to source files
4. Link the source to your Unity project: `ln -s /path/to/uquery/build/uQuery.js /path/to/unity/project/Assets/Plugins/uQuery.js`
5. Start hacking. Pull requests are warmly welcome!


## API documentation

You can find the current API documentation at the [uQuery forum thread](http://forum.unity3d.com/threads/157096-Weekend-project-jQuery-for-Unity-uQuery).
