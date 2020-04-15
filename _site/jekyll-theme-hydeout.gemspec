# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "saket-website-new"
  spec.version       = "3.0.0"
  spec.authors       = ["Saket Upadhyay"]
  spec.email         = ["x64mayhem@gmail.com"]

  spec.summary       = %q{The Hyde theme in Jekyll. for x64mayhem}
  spec.homepage      = "https://github.com/fongandrew/hydeout"
  spec.license       = "MIT"

  spec.metadata["plugin_type"] = "theme"

  spec.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^(assets|_(includes|layouts|sass)/|(LICENSE|README)((\.(txt|md|markdown)|$)))}i)
  end

  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }

  spec.add_runtime_dependency "jekyll", ">= 3.6", "< 5.0"
  spec.add_runtime_dependency "jekyll-gist", "~> 1.4"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.6"
  spec.add_development_dependency "bundler", "~> 2.1"
  spec.add_development_dependency "wdm", "~> 0.1" if Gem.win_platform?
end
