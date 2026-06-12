# eGovFrame 코드 템플릿

~~~java
@Service("{resource}Service")
public class {Resource}ServiceImpl extends EgovAbstractServiceImpl implements {Resource}Service {
  @Resource(name = "{resource}Mapper")
  private {Resource}Mapper {resource}Mapper;

  @Override
  public List<{Resource}VO> select{Resource}List({Resource}SearchVO searchVO) throws Exception {
    return {resource}Mapper.select{Resource}List(searchVO);
  }
}
~~~

~~~java
@Controller
@RequestMapping("/{resource}")
public class {Resource}Controller {
  @Resource(name = "{resource}Service")
  private {Resource}Service {resource}Service;

  @RequestMapping("/list.do")
  public String list(@ModelAttribute("searchVO") {Resource}SearchVO searchVO, ModelMap model) throws Exception {
    model.addAttribute("resultList", {resource}Service.select{Resource}List(searchVO));
    return "{resource}/list";
  }
}
~~~
