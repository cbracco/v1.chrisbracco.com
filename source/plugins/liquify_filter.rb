#
# LiquifyFilter
# Credit: http://stackoverflow.com/a/17046748/2057448
#

module Jekyll
  module LiquifyFilter
    def liquify(input)
      Liquid::Template.parse(input).render(@context)
    end
  end
end

Liquid::Template.register_filter(Jekyll::LiquifyFilter)
