# -*- encoding: utf-8 -*-
# stub: actionview 7.2.2.1 ruby lib

Gem::Specification.new do |s|
  s.name = "actionview".freeze
  s.version = "7.2.2.1".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.metadata = { "bug_tracker_uri" => "https://github.com/rails/rails/issues", "changelog_uri" => "https://github.com/rails/rails/blob/v7.2.2.1/actionview/CHANGELOG.md", "documentation_uri" => "https://api.rubyonrails.org/v7.2.2.1/", "mailing_list_uri" => "https://discuss.rubyonrails.org/c/rubyonrails-talk", "rubygems_mfa_required" => "true", "source_code_uri" => "https://github.com/rails/rails/tree/v7.2.2.1/actionview" } if s.respond_to? :metadata=
  s.require_paths = ["lib".freeze]
  s.authors = ["David Heinemeier Hansson".freeze]
  s.date = "2024-12-10"
  s.description = "Simple, battle-tested conventions and helpers for building web pages.".freeze
  s.email = "david@loudthinking.com".freeze
  s.homepage = "https://rubyonrails.org".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 3.1.0".freeze)
  s.requirements = ["none".freeze]
  s.rubygems_version = "3.5.22".freeze
  s.summary = "Rendering framework putting the V in MVC (part of Rails).".freeze

  s.installed_by_version = "3.6.9".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<activesupport>.freeze, ["= 7.2.2.1".freeze])
  s.add_runtime_dependency(%q<builder>.freeze, ["~> 3.1".freeze])
  s.add_runtime_dependency(%q<erubi>.freeze, ["~> 1.11".freeze])
  s.add_runtime_dependency(%q<rails-html-sanitizer>.freeze, ["~> 1.6".freeze])
  s.add_runtime_dependency(%q<rails-dom-testing>.freeze, ["~> 2.2".freeze])
  s.add_development_dependency(%q<actionpack>.freeze, ["= 7.2.2.1".freeze])
  s.add_development_dependency(%q<activemodel>.freeze, ["= 7.2.2.1".freeze])
end
