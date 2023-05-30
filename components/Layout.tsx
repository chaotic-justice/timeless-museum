import Header from './Header'


type Props = {
  children: React.ReactNode
}
const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div>{props.children}</div>
  </div>
)

export default Layout