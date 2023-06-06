const Footer = () => {
  return (
    <footer className="bg-gray-900 bg-opacity-90 text-white py-8 fixed w-full bottom-0">
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <h4 className="text-lg font-bold font-newsletter mb-2">Sign up for our newsletter to receive updates</h4>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter your email address"
              className="bg-white rounded-l-lg px-4 py-2 w-full"
            />
            <button className="bg-blue-600 hover:bg-blue-700 rounded-r-lg px-4 py-2">Subscribe</button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="flex justify-center md:justify-end">
            <button className="text-white font-semibold hover:text-gray-400 mx-2">Press</button>
            <button className="text-white font-semibold hover:text-gray-400 mx-2">Contact</button>
            <button className="text-white font-semibold hover:text-gray-400 mx-2">Careers</button>
            <button className="text-white font-semibold hover:text-gray-400 mx-2">About</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
