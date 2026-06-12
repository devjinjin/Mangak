# Spring Boot REST 코드 템플릿

~~~java
@RestController
@RequestMapping("/api/{resource}")
@RequiredArgsConstructor
class {Resource}Controller {
  private final {Resource}Service service;

  @GetMapping("/{id}")
  ResponseEntity<{Resource}Response> get(@PathVariable Long id) {
    return ResponseEntity.ok(service.get(id));
  }

  @PostMapping
  ResponseEntity<{Resource}Response> create(@Valid @RequestBody {Resource}CreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
  }
}
~~~

~~~java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
class {Resource}Service {
  private final {Resource}Repository repository;

  @Transactional
  {Resource}Response create({Resource}CreateRequest request) {
    var entity = {Resource}.create(request.name());
    return {Resource}Response.from(repository.save(entity));
  }
}
~~~
